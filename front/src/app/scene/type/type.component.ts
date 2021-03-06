/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { TypeService } from '../../service/type.service';
import { ArianeService } from '../../service/ariane.service';
import { environment } from 'environments/environment';

@Component({
	selector: 'app-type',
	templateUrl: './type.component.html',
	styleUrls: ['./type.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class TypeComponent implements OnInit {
	type_id = -1;
	name: string = "";
	description: string = "";
	cover:string = null;
	groups_error = "";
	groups = [];
	videos_error = "";
	videos = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private typeService: TypeService,
	            private arianeService: ArianeService) {
		/*
		this.route.params.subscribe(params => {
				console.log(params);
				if (params["id"]) {
					this.doSearch(params["id"]);
				}
			});
		*/
	}
	
	ngOnInit() {
		this.type_id = parseInt(this.route.snapshot.paramMap.get('type_id'));
		let self = this;
		console.log("get parameter id: " + this.type_id);
		this.typeService.get(this.type_id)
			.then(function(response) {
				self.name = response.name;
				self.description = response.description;
			}).catch(function(response) {
				self.name = "???";
				self.description = "";
			});
		this.typeService.getSubGroup(this.type_id)
			.then(function(response) {
				self.groups_error = "";
				self.groups = response
			}).catch(function(response) {
				self.groups_error = "Wrong e-mail/login or password";
				self.groups = []
			});
		this.typeService.getSubVideo(this.type_id)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Wrong e-mail/login or password";
				self.videos = []
			});
	}
	onSelectGroup(_event: any, _idSelected: number):void {
		if(_event.which==2) {
			if (environment.frontBaseUrl === undefined || environment.frontBaseUrl === null || environment.frontBaseUrl === "") {
				window.open('/group/' + _idSelected);
			} else {
				window.open("/" + environment.frontBaseUrl + '/group/' + _idSelected);
			}
		} else {
			this.router.navigate(['/group/' + _idSelected ]);
			this.arianeService.setGroup(_idSelected);
		}
	}
	
	onSelectVideo(_event: any, _idSelected: number):void {
		//console.log("event: " + _event.which);
		if(_event.which==2) {
			if (environment.frontBaseUrl === undefined || environment.frontBaseUrl === null || environment.frontBaseUrl === "") {
				window.open('/video/' + _idSelected);
			} else {
				window.open("/" + environment.frontBaseUrl + '/video/' + _idSelected);
			}
		} else {
			this.router.navigate(['/video/' + _idSelected ]);
			this.arianeService.setVideo(_idSelected);
		}
	}

}

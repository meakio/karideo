/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../_animations/index';

import { TypeService } from '../type.service';

@Component({
	selector: 'app-type-detail',
	templateUrl: './type-detail.component.html',
	styleUrls: ['./type-detail.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class TypeDetailComponent implements OnInit {
	type_id = -1;
	groups_error = "";
	groups = [{name:"group1"}, {name:"group2"}, {name:"group3"}];
	videos_error = "";
	videos = [{name:"video1"}, {name:"video2"}, {name:"video3"}];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private typeService: TypeService) {
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
		this.type_id = parseInt(this.route.snapshot.paramMap.get('id'));
		let self = this;
		console.log("get parameter id: " + this.type_id);
		this.typeService.getSubGroup(this.type_id)
			.then(function(response) {
				self.groups_error = "";
				self.groups = response
			}).catch(function(response) {
				self.groups_error = "Wrong e-mail/login or password";
				self.groups = []
			});
		this.typeService.getSubVideoNoGroup(this.type_id)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Wrong e-mail/login or password";
				self.videos = []
			});
	}
	onSelectGroup(_idSelected: number):void {
		this.router.navigate(['group/' + _idSelected ]);
	}
	
	onSelectVideo(_idSelected: number):void {
		this.router.navigate(['video/' + _idSelected ]);
	}

}
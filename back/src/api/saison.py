#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2019, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##

import time
import json
import os
import sys
import datetime
import time, threading
import realog.debug as debug

from sanic import Sanic
from sanic import response
from sanic import views
from sanic import Blueprint
from sanic.exceptions import ServerError

from sanic_simple_swagger import swagger_blueprint, openapi_blueprint
from sanic_simple_swagger import doc

import tools
import data_interface
import data_global_elements

def add(_app, _name_api):
	elem_blueprint = Blueprint(_name_api)
	
	class DataModelBdd:
		id = int
		number = int
		description = [str, type(None)]
		group_id = int
		covers = [[], type(None)]
	
	data_global_elements.get_interface(_name_api).set_data_model(DataModelBdd)
	
	class DataModel:
		number = int
		description = str
		group_id = int
	
	@elem_blueprint.get('/' + _name_api, strict_slashes=True)
	@doc.summary("Show saisons")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def list(request):
		return response.json(data_global_elements.get_interface(_name_api).gets())
	
	@elem_blueprint.post('/' + _name_api, strict_slashes=True)
	@doc.summary("Create new saison")
	@doc.description("Create a new saison for a aspecific group id.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful created')
	async def create(request):
		return response.json(data_global_elements.get_interface(_name_api).post(request.json))
	
	@elem_blueprint.post('/' + _name_api + "/find", strict_slashes=True)
	@doc.summary("find a season existance")
	@doc.description("return the ID of the season table.")
	@doc.consumes(DataModel, location='body')
	@doc.response_success(status=201, description='If successful created')
	async def find_with_name(request):
		api = data_global_elements.get_interface(_name_api)
		for elem in api.bdd:
			if     elem["group_id"] == request.json["group_id"] \
			   and elem["number"] == request.json["number"]:
				return response.json({"id": elem["id"]})
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def retrive(request, id):
		value = data_global_elements.get_interface(_name_api).get(id)
		if value != None:
			return response.json(value)
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.put('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Update resource")
	@doc.description("Update the specified resource in storage.")
	@doc.response_success(status=201, description='If successful updated')
	async def update(request, id):
		ret = data_global_elements.get_interface(_name_api).put(id, request.json)
		return response.json({})
	
	@elem_blueprint.delete('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Remove resource")
	@doc.description("Remove the specified resource from storage.")
	@doc.response_success(status=201, description='If successful deleted')
	async def delete(request, id):
		ret = data_global_elements.get_interface(_name_api).delete(id)
		if ret == True:
			return response.json({})
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.post('/' + _name_api + "/<id:int>/add_cover", strict_slashes=True)
	@doc.summary("Add cover on video")
	@doc.description("Add a cover data ID to the video.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful added')
	async def create(request, id):
		for type_key in ["data_id"]:
			if type_key not in request.json.keys():
				raise ServerError("Bad Request: Missing Key '" + type_key + "'", status_code=400)
		# TODO: check if it is a number...
		value = data_global_elements.get_interface(_name_api).get(id)
		if value == None:
			raise ServerError("No data found", status_code=404)
		if "covers" not in value.keys():
			value["covers"] = [];
		
		for elem in value["covers"]:
			if request.json["data_id"] == elem:
				return response.json(elem)
		value["covers"].append(request.json["data_id"]);
		data_global_elements.get_interface(_name_api).set(id, value)
		return response.json(value)
	
	_app.blueprint(elem_blueprint)

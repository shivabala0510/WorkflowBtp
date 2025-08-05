sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("mtaworkflow.controller.Detail", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(oEvent)
        {
            var oParameters = oEvent.getParameter("arguments");
            var sWorkflowId =  oParameters.id;
            var sWorkflowType =  oParameters.Type;
            this.getView().getModel("InputModel").setProperty("/DetailId",sWorkflowId);
            this.getView().getModel("InputModel").setProperty("/DetailType",sWorkflowType);
            if(sWorkflowType === "Edit")
            {
            this._onLoadWorkFlowDetails(sWorkflowId);
            }
            else if (sWorkflowType === "Create")
            {
                 this.getView().getModel("WorkFlowDetails").setProperty("/",{});
                 this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowCond",{});
                this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowCond/results",[{
                    COND_KEY:"",
                    VALUE:"",  
                  }]);
                  this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowStep",{});
                this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowStep/results",[]);
                this.getView().getModel("WorkFlowDetails").setProperty("/WORKFLOW_ID","");
                this.getView().getModel("WorkFlowDetails").setProperty("/DESCRIPTION","");
                this.getView().getModel("InputModel").setProperty("/SaveButton",true);
                this.getView().getModel("InputModel").setProperty("/UpdateButton",false);
            }
        },


        _onLoadWorkFlowDetails:function(sWorkFlowId)
        {
            this.getView().setBusy(true);
            var aFilters = [];
            aFilters.push(new sap.ui.model.Filter("WORKFLOW_ID", sap.ui.model.FilterOperator.EQ, sWorkFlowId));
            var oDataModel = this.getOwnerComponent().getModel();
            oDataModel.read("/PrWorkFlowHeadSet", {
				filters: aFilters,
				urlParameters: {
					"async": true,
					"$expand": "PrWorkFlowCond,PrWorkFlowStep"
				},
				success: function(oData, oResponse) {
					this.getView().setBusy(false);
                    this.getView().getModel("WorkFlowDetails").setProperty("/",oData.results[0]);
                    this.getView().getModel("InputModel").setProperty("/SaveButton",false);
                    this.getView().getModel("InputModel").setProperty("/UpdateButton",true);
				}.bind(this),
				error: function(oError) {
					this.getView().setBusy(false);
					MessageBox.error("Read Failed");

				}.bind(this)
			});
        },
        onAddPress:function(oEvent)
        {
            var oJSData = this.getView().getModel("WorkFlowDetails").getProperty("/PrWorkFlowCond/results");
            oJSData.push({
                COND_KEY:"",
                VALUE:"",
                WORKFLOW_ID:this.getView().getModel("WorkFlowDetails").getProperty("/WORKFLOW_ID")

            });
            this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowCond/results",oJSData);
        },
        onDeletePress:function(oEvent)
        {
            var spath = oEvent.getSource().getBindingContext("WorkFlowDetails").getPath();
            spath = spath.split("/");
            var indexToRemove = parseInt(spath[1])
            var aData = this.getView().getModel("WorkFlowDetails").getProperty("/PrWorkFlowCond/results");
            aData.splice(indexToRemove, 1);
            this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowCond/results", aData);
        },
        onSavePress:function()
        {
            var oData = JSON.parse(JSON.stringify(this.getOwnerComponent().getModel("WorkFlowDetails").getProperty("/")));
            oData.VALID_FROM_DATE = new Date(oData.VALID_FROM_DATE);
            oData.VALID_FROM_DATE = this.changeDateToUTC(oData.VALID_FROM_DATE);
            oData.VALID_TO_DATE = new Date(oData.VALID_TO_DATE);
            oData.VALID_TO_DATE = this.changeDateToUTC(oData.VALID_TO_DATE);
            this._UpdateData(oData);
           
        },

        prepareDatesToDisplay: function (oDate) { //to display dates from backend
			var oTempDate = new Date(oDate);
			oDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (60000));
			return oDate;
		},
		changeDateToUTC: function (oDate) { //for sending dates to backend
			var oTempDate = new Date(oDate.setHours("00", "00", "00", "00"));
			oDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (-60000));
			return oDate;
		},

        onUpdatePress:function()
        {
            var id = this.getView().getModel("InputModel").getProperty("/DetailId");
            var sUpdateData = JSON.parse(JSON.stringify(this.getView().getModel("WorkFlowDetails").getProperty("/")));
            //this.getView().getModel("WorkFlowHeader").setProperty("/" +id ,sUpdateData);
            sUpdateData.VALID_FROM_DATE = new Date(sUpdateData.VALID_FROM_DATE);
            sUpdateData.VALID_FROM_DATE = this.changeDateToUTC(sUpdateData.VALID_FROM_DATE);
            sUpdateData.VALID_TO_DATE = new Date(sUpdateData.VALID_TO_DATE);
            sUpdateData.VALID_TO_DATE = this.changeDateToUTC(sUpdateData.VALID_TO_DATE);
           
            this._UpdateData(sUpdateData);
          
        },

        _UpdateData:function(oPayload)
        {

            var oDataModel = this.getOwnerComponent().getModel();
			oDataModel.create("/PrWorkFlowHeadSet", oPayload, {
				success: function(oData, oResponse) {
					this.getView().setBusy(false);
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("Initial");
				}.bind(this),
				error: function(oError) {
					this.getView().setBusy(false);
					sap.m.MessageBox.error("Update Failed");
					
				}.bind(this)
			});
        },
        onStepPress:function(oEvent)
        {
            var spath = oEvent.getSource().getBindingContext("WorkFlowDetails").getPath();
            spath = spath.split("/");
            var indexToRemove = parseInt(spath[3]);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var sId = indexToRemove; // or get it from model / event
            oRouter.navTo("StepDetail", {
                id: sId,
                Type:"Edit"
            });
        },
        onStepCreatePress:function(oEvent)
        {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          
            oRouter.navTo("StepDetail", {
                id: "0",
                Type:"Create"
            });
        }
    });
});

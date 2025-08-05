sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("mtaworkflow.controller.Initial", {
        onInit: function () {
            // this._getDummyData();
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Initial").attachPatternMatched(this._onRouteMatchedInit, this);
        },
        _onRouteMatchedInit:function(oEvent)
        {
            this._onLoadWorkFlow();
        },

        _onLoadWorkFlow:function(sWorkFlowId)
        {

           // sap.ushell.Container.getUser().getEmail()
            var oDataModel = this.getOwnerComponent().getModel();
            oDataModel.read("/PrWorkFlowHeadSet", {
				// filters: aFilters,
				urlParameters: {
					"async": true,
					"$expand": "PrWorkFlowCond,PrWorkFlowStep"
				},
				success: function(oData, oResponse) {
					this.getView().setBusy(false);
                    this.getOwnerComponent().getModel("WorkFlowHeader").setProperty("/", oData.results);
				}.bind(this),
				error: function(oError) {
					this.getView().setBusy(false);

				}.bind(this)
			});
        },
        _createPress:function()
        {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var sId = "0"; // or get it from model / event
            oRouter.navTo("Detail", {
                id: sId,
                Type:"Create"
            });
        },
        _editPress:function(oEvent)
        {
          var sWorkflowId = oEvent.getSource().getBindingContext("WorkFlowHeader").getObject().WORKFLOW_ID;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var sId = sWorkflowId; // or get it from model / event
            oRouter.navTo("Detail", {
                id: sId,
                Type:"Edit"
            });
        },

        _getDummyData:function()
        {
            var aJSON = [
                {
                    Name:"Workflow1",
                    Description:"Workflow Description",
                    ValidFrom:"2025-05-05",
                    ValidTo:"2025-06-01",
                    Conditions:[
                        {
                            key:"CC",
                            value:"1010"
                        },
                        {
                            key:"DT",
                            value:"NB"
                        }

                    ],
                    Steps:[
                        {
                            Type:"1",
                            Name:"Step1",
                            Recepients:"Michel Kelvin",
                            StepCondition:"Company Code is 1010"
                        },
                        {
                            Type:"2",
                            Name:"Step2",
                            Recepients:"Ana SUn",
                            StepCondition:"Company Code is 1010"
                        }
                    ]
                }
            ];
            this.getOwnerComponent().getModel("WorkFlowHeader").setProperty("/",aJSON);
        }

    });
});

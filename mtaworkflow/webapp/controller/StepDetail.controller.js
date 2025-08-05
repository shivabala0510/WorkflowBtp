sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("mtaworkflow.controller.StepDetail", {


        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("StepDetail").attachPatternMatched(this._onRouteMatchedStep, this);
        },
        _onRouteMatchedStep:function(oEvent)
        {
            var oParameters = oEvent.getParameter("arguments");
            var sWorkflowId =  oParameters.id;
            var sWorkflowType =  oParameters.Type;
            this.getView().getModel("InputModel").setProperty("/StepDetailId",sWorkflowId);
            this.getView().getModel("InputModel").setProperty("/StepDetailType",sWorkflowType);
            if(sWorkflowType === "Edit")
            {
            var aSelected = this.getView().getModel("WorkFlowDetails").getProperty("/PrWorkFlowStep/results/" +sWorkflowId);
            this.getView().getModel("WorkFlowStepDetails").setProperty("/",aSelected);
            this.getView().getModel("InputModel").setProperty("/SaveStepButton",false);
            this.getView().getModel("InputModel").setProperty("/UpdateStepButton",true);
            }
            else if (sWorkflowType === "Create")
            {
                this.getView().getModel("WorkFlowStepDetails").setProperty("/",{});
                this.getView().getModel("WorkFlowStepDetails").setProperty("/STEP_NAME","");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/STEP_TYPE","");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/ASSIGNED_BY","");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/WF_RECEPIENT","");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/ALLR",false);
                this.getView().getModel("WorkFlowStepDetails").setProperty("/ONER",false);
                this.getView().getModel("InputModel").setProperty("/SaveStepButton",true);
                this.getView().getModel("InputModel").setProperty("/UpdateStepButton",false);
            }
        },
        onStepsSavePress:function()
        {
            var oData = JSON.parse(JSON.stringify(this.getOwnerComponent().getModel("WorkFlowStepDetails").getProperty("/")));
            var oHeaderList = this.getOwnerComponent().getModel("WorkFlowDetails").getProperty("/PrWorkFlowStep/results");
            oHeaderList.push(oData);
            this.getOwnerComponent().getModel("WorkFlowDetails").setProperty("/PrWorkFlowStep/results",oHeaderList);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", {
                id: 0,
                Type:"Created"
            });
        },
        onStepsUpdatePress:function()
        {
            var stepid = this.getView().getModel("InputModel").getProperty("/StepDetailId");
            var sUpdateData = JSON.parse(JSON.stringify(this.getView().getModel("WorkFlowStepDetails").getProperty("/")));
            this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowStep/results/" +stepid ,sUpdateData); 
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", {
                id: 0,
                Type:"Created"
            });
        }





	});
});
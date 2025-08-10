sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
], function (
    Controller, Fragment,Filter,FilterOperator
) {
    "use strict";

    return Controller.extend("mtaworkflow.controller.StepDetail", {


        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("StepDetail").attachPatternMatched(this._onRouteMatchedStep, this);
        },
        _onRouteMatchedStep: function (oEvent) {
            var oParameters = oEvent.getParameter("arguments");
            var sWorkflowId = oParameters.id;
            var sWorkflowType = oParameters.Type;
            this.getView().getModel("InputModel").setProperty("/StepDetailId", sWorkflowId);
            this.getView().getModel("InputModel").setProperty("/StepDetailType", sWorkflowType);
            if (sWorkflowType === "Edit") {
                var aSelected = this.getView().getModel("WorkFlowDetails").getProperty("/PrWorkFlowStep/results/" + sWorkflowId);
                this.getView().getModel("WorkFlowStepDetails").setProperty("/", aSelected);
                this.getView().getModel("InputModel").setProperty("/SaveStepButton", false);
                this.getView().getModel("InputModel").setProperty("/UpdateStepButton", true);
            }
            else if (sWorkflowType === "Create") {
                this.getView().getModel("WorkFlowStepDetails").setProperty("/", {});
                this.getView().getModel("WorkFlowStepDetails").setProperty("/STEP_NAME", "");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/STEP_TYPE", "");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/ASSIGNED_BY", "");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/WF_RECEPIENT", "");
                this.getView().getModel("WorkFlowStepDetails").setProperty("/ALLR", false);
                this.getView().getModel("WorkFlowStepDetails").setProperty("/ONER", false);
                this.getView().getModel("InputModel").setProperty("/SaveStepButton", true);
                this.getView().getModel("InputModel").setProperty("/UpdateStepButton", false);
            }
            this._getUser();
        },
        onStepsSavePress: function () {
            var oData = JSON.parse(JSON.stringify(this.getOwnerComponent().getModel("WorkFlowStepDetails").getProperty("/")));
            var oHeaderList = this.getOwnerComponent().getModel("WorkFlowDetails").getProperty("/PrWorkFlowStep/results");
            oHeaderList.push(oData);
            this.getOwnerComponent().getModel("WorkFlowDetails").setProperty("/PrWorkFlowStep/results", oHeaderList);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", {
                id: 0,
                Type: "Created"
            });
        },
        onStepsUpdatePress: function () {
            var stepid = this.getView().getModel("InputModel").getProperty("/StepDetailId");
            var sUpdateData = JSON.parse(JSON.stringify(this.getView().getModel("WorkFlowStepDetails").getProperty("/")));
            this.getView().getModel("WorkFlowDetails").setProperty("/PrWorkFlowStep/results/" + stepid, sUpdateData);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", {
                id: 0,
                Type: "Created"
            });
        },
        handleTableSelectDialogPress: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "mtaworkflow.fragments.User",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
            }.bind(this));
        },

        handleSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("BNAME", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        handleClose: function (oEvent) {
			// reset the filter
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);
			var aContexts = oEvent.getParameter("selectedContexts");
            this.getView().getModel("WorkFlowStepDetails").setProperty("/WF_RECEPIENT",aContexts[0].getObject().BNAME );
            this.getView().getModel("WorkFlowStepDetails").setProperty("/WF_RECEPIENT_MAIL",aContexts[0].getObject().MAIL_ID );

		},
        _getUser:function()
        {
             
    
                var oDataModel = this.getOwnerComponent().getModel();
                oDataModel.read("/UserVhelpListSet", {
                    success: function (oData, oResponse) {
                        this.getView().setBusy(false);
                        var oModel = new sap.ui.model.json.JSONModel(oData);
                        this.getView().setModel(oModel, "User");
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);

                    }.bind(this)
                });
           
        }



    });
});
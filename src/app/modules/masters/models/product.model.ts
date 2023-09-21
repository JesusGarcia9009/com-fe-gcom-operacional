export interface ProductModel {
    id : number;
	salePrice : number;
	netCost : number;
	stock: number;
	rowNumb : string;
	colNumb : string;
	description : string;
	providerDescription : string;
	
	modelId : number;
	modelCode : string;
	modelDescription : string;
	modelMeasure : string;
	modelVehicleType : string;
	modelApproximateYear : string;
	modelEngineDescription : string;
	modelTypeOfMotor : string;
	modelNotes : string;
	modelMast : string;
	
    brandId : number;
	brandCode : string;
	brandDescription : string;
	
	productReferenceId : number;
	productReferenceGis : string;
	productReferenceDesc : string;
	
    productTypeId : number;
	productTypeCode : string;
	productTypeDescription : string;
	
    sourceId : number;
	sourceCode : string;
	sourceDescription : string;

    universalGroupId : number;
	universalGroupCode : string;
	universalGroupDescription : string;

	originalCodeList: Array<string>;
	providerCodeList: Array<string>;
	glossList: Array<string>;
}

export interface ProductSelectModel {
    id : number;
	salePrice : number;
	netCost : number;
	stock: number;
	rowNumb : string;
	colNumb : string;
	description : string;
	providerDescription : string;
	
	modelId : number;
	modelCode : string;
	modelDescription : string;
	modelMeasure : string;
	modelVehicleType : string;
	modelApproximateYear : string;
	modelEngineDescription : string;
	modelTypeOfMotor : string;
	modelNotes : string;
	modelMast : string;
	
    brandId : number;
	brandCode : string;
	brandDescription : string;
	
	productReferenceId : number;
	
    productTypeId : number;
	productTypeCode : string;
	productTypeDescription : string;
	
    sourceId : number;
	sourceCode : string;
	sourceDescription : string;

    universalGroupId : number;
	universalGroupCode : string;
	universalGroupDescription : string;
}
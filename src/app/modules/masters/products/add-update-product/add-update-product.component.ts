import { ProductTypeService } from './../../../maintainer/service/product-type.service';
import { ProductService } from './../../service/product.service';
import { UniversalgroupsService } from './../../../maintainer/service/universalgroups.service';
import { BrandService } from './../../../maintainer/service/brand.service';
import { ProductModel, ProductSelectModel } from './../../models/product.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription, zip } from 'rxjs';
import { ItemModel } from 'src/app/modules/maintainer/models/item.model';
import { ModelModel } from 'src/app/modules/maintainer/models/model.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from 'src/app/modules/maintainer/service/model.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { SourceService } from 'src/app/modules/maintainer/service/source.service';
import { MaintainerProperties } from 'src/app/modules/maintainer/properties/maintainer.properties';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.css']
})
export class AddUpdateProductComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: ProductModel;
  public modelSelected: ModelModel;
  public formTitle: string = 'Registro de producto';
  public isReadOnly: boolean;
  public isLoadingBrand: boolean;

  
  //list
  public brandList: Array<ItemModel>;
  public modelList: Array<ModelModel>;
  public sourceList: Array<ItemModel>;
  public groupList: Array<ItemModel>;
  public typeList: Array<ItemModel>;
  public productList: Array<ProductSelectModel>;

  public originalCodeList: Array<string> = [];
  public providerCodeList: Array<string> = [];
  public glossList: Array<string> = [];

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private elemntService: ProductService,
    private brandService: BrandService,
    private modelService: ModelService,
    private sourceService: SourceService,
    private groupService: UniversalgroupsService,
    private typeService: ProductTypeService,
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.elemntService.elementSelected;
    sessionStorage.setItem('title', 'Producto');

    if (this.elementSelected) {
      this.formTitle = 'Edición de Producto';
    }
    this.iniciarFormulario();
  }



  iniciarFormulario() {
    if (this.isReadOnly) {
      this.registerItemForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        salePrice: [{ value: null, disabled: true }, []],
        netCost: [{ value: null, disabled: true }, []],
        rowNumb: [{ value: null, disabled: true }, []],
        colNumb: [{ value: null, disabled: true }, []],
        description: [{ value: null, disabled: true }, []],
        providerDescription: [{ value: null, disabled: true }, []],
        modelId: [{ value: null, disabled: true }, []],
        brandId: [{ value: null, disabled: true }, []],
        productReferenceId: [{ value: null, disabled: true }, []],
        productTypeId: [{ value: null, disabled: true }, []],
        sourceId: [{ value: null, disabled: true }, []],
        universalGroupId: [{ value: null, disabled: true }, []],
        originalCode: [{ value: null, disabled: true }, []],
        providerCode: [{ value: null, disabled: true }, []],
        gloss: [{ value: null, disabled: true }, []]
      });
    } else {
      this.registerItemForm = this.fb.group({
        id: ['', []],
        salePrice: ['', []],
        netCost: ['', []],
        rowNumb: ['', []],
        colNumb: ['', []],
        description: ['', []],
        providerDescription: ['', []],
        modelId: ['', []],
        brandId: ['', []],
        productReferenceId:  ['', []],
        productTypeId: ['', []],
        sourceId: ['', []],
        universalGroupId: ['', []],
        originalCode: ['', []],
        providerCode: ['', []],
        gloss: ['', []]
      });
    }
      
    if (this.elementSelected) {
      this.initLoad(this.elementSelected);
    } else {
      this.initLoad();
    }
  }

  get registerFormControls() { return this.registerItemForm.controls; }

  initLoad(elementSelected: ProductModel = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.brandService.getAll(),
        this.modelService.getListBy(-1),
        this.sourceService.getAll(),
        this.groupService.getAll(),
        this.typeService.getAll(),
        this.elemntService.getAllSelect()
      ).subscribe(result => {
        this.loadingService.hide();
        this.brandList = result[0];
        this.modelList = result[1];
        this.sourceList = result[2];
        this.groupList = result[3];
        this.typeList = result[4];
        this.productList = result[5];
        if (elementSelected) {
          this.registerItemForm.patchValue(elementSelected);
          this.glossList = elementSelected.glossList;
          this.providerCodeList = elementSelected.providerCodeList;
          this.originalCodeList = elementSelected.originalCodeList;
        }
      })
    );
  }

  onSelectChange(brandId, countryDefaultSelected = null) {
    this.isLoadingBrand = true;
    this.subscriptions.push(
      this.modelService.getListBy(brandId).subscribe(models => {
        this.modelList = models;
        this.isLoadingBrand = false;
        this.registerFormControls.brandId.setValue(brandId);
      })
    );
  }

  onRegisterSubmit() {
    const formValue: ProductModel = this.registerItemForm.value;
    if (this.elementSelected) {
      formValue.id = this.elementSelected.id;
    }else{
      formValue.id = null;
    }
    formValue.glossList = this.glossList;
    formValue.providerCodeList = this.providerCodeList;
    formValue.originalCodeList = this.originalCodeList;

    this.subscriptions.push(this.elemntService.save(formValue).subscribe(async value => {
      const textRegistro = this.elementSelected ? 'editado' : 'registrado';
      await this.modalService.open(
        {
          titulo: `Producto ${textRegistro}`,
          texto: `El producto fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarUser'
        }
      );
      this.registerItemForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {

      if (err.error === MaintainerProperties.PRODUCT_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Producto duplicado',
            texto: 'El código que desea agregar ya se encuentra registrado.',
            icono: 'info',
            mostrarBotonCancelar: false,
            textoAceptar: 'Aceptar',
            identificadorConfirmar: 'btn-GuardarUser'
          }
        );
      } else {
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }
    }));
  }

  volver() {
    this.router.navigate(['masters/index/0']);
  }

  addOriginalCode() {
    const formValue = this.registerItemForm.value;
    const value = formValue.originalCode;
    this.originalCodeList.push(value);
    this.registerFormControls.originalCode.setValue('');
  }

  addProviderCode() {
    const formValue = this.registerItemForm.value;
    const value = formValue.providerCode;
    this.providerCodeList.push(value);
    this.registerFormControls.providerCode.setValue('');
  }

  addGloss() {
    const formValue = this.registerItemForm.value;
    const value = formValue.gloss;
    this.glossList.push(value);
    this.registerFormControls.gloss.setValue('');
  }

  deleteOriginalCode(item: string) {
    const index = this.originalCodeList.indexOf(item);
    this.originalCodeList.splice(index, 1);
  }

  deleteProviderCode(item: string) {
    const index = this.providerCodeList.indexOf(item);
    this.providerCodeList.splice(index, 1);
  }

  deleteGloss(item: string) {
    const index = this.glossList.indexOf(item);
    this.glossList.splice(index, 1);
  }


  ngOnDestroy() {
    this.elemntService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}


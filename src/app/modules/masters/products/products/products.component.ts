import { ProductService } from './../../service/product.service';
import { ProductModel } from '../../models/product.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { LoadingService } from '../../../core/core/services/loading.service';
import { ModalService } from '../../../core/core/services/modal.service';
import { SharedService } from '../../../shared/shared.service';
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public productListData: Array<ProductModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: ProductModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private productService: ProductService,
    // private propiedadService: PropiedadService,
    // private documentosService: DocumentosService
  ) { }

  ngOnInit() {
    this.iniciarTabla();
  }

  iniciarTabla() {


    this.dtOptions = this.getDtOptions();

    this.subscriptions.push(this.productService.getAll().subscribe(async data => {

      this.tblData = data;
      this.productListData = data;

      const dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.destroy();
      }
      this.dtTrigger.next();
    }, async err => {

      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.iniciarTabla();
      }
    }));
  }

  getDtOptions() {
    const defaultConf = this.sharedService.getDefaultDataTableConfig();
    return {
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      aoColumns: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(product: ProductModel) {
    this.productService.elementSelected = product;
    this.router.navigate(['/masters/add-upd-product']);
  }

  redirectToView(product: ProductModel) {
    this.productService.elementSelected = product;
    this.router.navigate(['/masters/add-upd-product/ver']);
  }

  redirectToSimilar(product: ProductModel) {
    this.subscriptions.push(this.productService.findById(product.productReferenceId).subscribe(async data => {

      this.productService.elementSelected = data;
      this.router.navigate(['/masters/add-upd-product/ver']);
    }, async err => {

      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.iniciarTabla();
      }
    }));
    
  }


  async onDelete(productSelected: ProductModel) {

    // const estadoPropiedadCondition = productSelected.estadoProduct === 1;

    const resultModal = await this.modalService.open(
      {
        titulo: 'Eliminar',
        texto: `¿Esta seguro que desea eliminar al product "${productSelected.brandCode +'-'+ productSelected.universalGroupCode+ '-' + productSelected.modelCode+ '-' + productSelected.sourceCode}"?`,
        icono: 'warning',
        mostrarBotonCancelar: true,
        textoAceptar: 'Confirmar',
        identificadorConfirmar: 'btn-AceptarCambioEstadoPropiedad',
        textoCancelar: 'Cancelar',
        identificadorCancelar: 'cancel',
      }
    );
    if (resultModal) {
      this.loadingService.show();
      // se envia el contrario , si estadoActual es 1 "Activa" se envia a desactivar "Estado 0"
      // productSelected.estadoProduct = estadoPropiedadCondition ? 0 : 1;

      this.subscriptions.push(this.productService.delete(productSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Eliminacion de producto',
            texto: `El producto "${productSelected.brandCode +'-'+ productSelected.universalGroupCode+ '-' + productSelected.modelCode+ '-' + productSelected.sourceCode}" se ha eliminado correctamente.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Confirmar',
            identificadorConfirmar: 'btn-AceptarCambioEstadoPropiedad',
          }
        );

        this.iniciarTabla();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onDelete(productSelected);
        }
      }));
    }
  }

  downloadReport() {
    // this.loadingService.show();
    // this.subscriptions.push(this.propiedadService.descargarReporteProduct().subscribe(blob => {
    //   this.loadingService.hide();
    //   const fullYear = new Date().getFullYear();
    //   const month = new Date().getMonth() + 1;
    //   const padMonth = this.pad(month, 2);
    //   const day = this.pad(new Date().getDate(), 2);


    //   importedSaveAs(blob, 'PROYECTOS_' + fullYear + month + day + '.xlsx');
    // }, async err => {
    //   this.loadingService.hide();
    //   const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
    //   if (modalResult) {
    //     this.descargarReporteProduct();
    //   }
    // }));
  }

  pad(num, size) {
    let s = "000000000" + num;
    return s.substr(s.length - size);
  }
  async ngOnDestroy() {

    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}

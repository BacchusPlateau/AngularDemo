import { Component, OnInit } from '@angular/core';
import { IProduct } from './product';
import { ProductService } from './product.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})



export class ProductListComponent implements OnInit {

    constructor(productService: ProductService) {
      this._productService = productService;
    }

    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    errorMessage: string = '';
    sub! : Subscription;
    
    private _listFilter: string = '';
    private _productService: ProductService;

    get listFilter(): string {
      return this._listFilter;
    }

    set listFilter(value: string) {
      this._listFilter = value;
      console.log('In setter');
      this.filteredProducts = this.performFilter(value);
    }

    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];

    onRatingClicked(message: string) : void {
      this.pageTitle = 'Product List: ' + message;
    }

    performFilter(filterBy: string): IProduct[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.products.filter((product: IProduct) => product.productName.toLocaleLowerCase().includes(filterBy));
    }

    toggleImage() : void {

        this.showImage = !this.showImage;

    }

    ngOnInit() : void {
      this.sub = this._productService.getProducts().subscribe({
        next: data => this.onDataComplete(data),
        error: err => this.errorMessage = err
      });
        
      this.filteredProducts = this.products;
      console.log('on init');
    }

    onDataComplete(data: IProduct[]){
      this.products = data;
      this.filteredProducts = this.products;
    }


    ngOnDestroy() {
      this.sub.unsubscribe();
      console.log('subscription destroyed');
    }
}
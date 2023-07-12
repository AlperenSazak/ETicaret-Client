import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Create_Product } from 'src/app/contracts/create_product';
import { List_Product } from 'src/app/contracts/list_product';
import { List_Product_Image } from 'src/app/contracts/list_product_image';
import { HttpClientService } from 'src/app/services/common/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) { }

  create (product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) 
  {
    this.httpClientService.post({
      controller: "products"
    }, product)
    .subscribe(result => {
      successCallBack();
    }, (errorResponse: HttpErrorResponse) => {
      const _error: Array<{key: string, value:Array<string>}> = errorResponse.error;
      let message = "";
      _error.forEach((v, index) => {
        v.value.forEach((_v, _index) => {
          message += `${_v}<br>`;
        });
      });
      errorCallBack(message);
    });
  }

  async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: 
    string) => void): Promise<{ totalProductCount: number; products: List_Product[] }> {    
      const promiseData: Promise<{ totalProductCount: number; products: List_Product[] }> = 
      this.httpClientService.get<{ totalProductCount: number; products: List_Product[] }>({
      controller: "products",
      queryString: `&Page=${page}&Size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack())
      .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message))

    return await promiseData;
  

  
  }

  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id);

    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      action:"getproductimages",
      controller:"products"
    }, id);

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();
    return images;
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete({
      action: "deleteproductimage",
      controller: "products",
      queryString: `&imageId=${imageId}`
    }, id)
    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: ()=> void):
  Promise<void> {
    const queryString = `&imageId=${imageId}&productId=${productId}`.replace(/\s/g,'%20');
    const changeShowcaseImageObservable = this.httpClientService.get({
      controller: "products",
      action: "ChangeShowcaseImage",
      queryString: queryString
    });
    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }

  async updateStockQrCodeToProduct(prooductId: string, stock: number, successCallBack?: () => void) {
    const observable = this.httpClientService.put({
      action: "qrcode",
      controller: "products"
    }, {
      prooductId, stock
    });

    await firstValueFrom(observable);
    successCallBack();
  }
}
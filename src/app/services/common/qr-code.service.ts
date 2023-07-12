import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor(private httpClienService: HttpClientService) { }

  async generateQRCode(productId: string) {
    const observable: Observable<Blob> = this.httpClienService.get({
      controller: "products",
      action: "qrcode",
      responseType: 'blob'
    }, productId)

    return await firstValueFrom(observable);
  }
}

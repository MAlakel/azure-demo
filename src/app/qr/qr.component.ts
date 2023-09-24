// Angular
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent {
  currentURL!: string;
  clientId: string;
  /**
   *
   */
  constructor(@Inject(DOCUMENT) private document: any,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.clientId = params.get('id')!;
        console.log(this.clientId);
        this.httpClient.get(`/api/getClientById?clientId=${this.clientId}`)
          .subscribe((resp: any) => this.clientId = resp);
        this.currentURL = document.location.href
        console.log(this.currentURL); // FULL URL
        this.listMembers(this.clientId);

        // this.httpClient.get(`/api/generateQRCode`)
        //   .subscribe((resp: any) => console.log('qr url:', resp));

        this.renderQR();
      }
    });
  }
  renderQR() {
    var canvas = document.getElementById('canvas');

    QRCode.toCanvas(canvas, this.currentURL, {
      color: {
        dark: '#000',  // Black dots
        light: '#0000' // Transparent background
      },
      width: 256
    }, function (error) {
      if (error) console.error(error)
      console.log('success!');
    });
  }

  downloadFile(imageType: string): any {
    return this.httpClient.get(`/api/generateQRCode?imageType=${imageType}&url=${encodeURIComponent(this.currentURL)}`, { responseType: 'blob' })
      .subscribe((response: any) => {
        console.log('qr url:', response);
        let blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        // window.open(url);
        saveAs(blob, `${this.clientId}.${imageType}`);
      });
  };

  downloadQR(imageType: string) {
    this.downloadFile(imageType);
  }

  async listMembers(clientId: string) {
    const gql = `
      query getMemberById($memberId: String) {
        member_by_pk(_partitionKeyValue: $memberId) {
          MemberId
          ClientName
          ClientCode
          BIN
          PCN
          AccountOwner
          RxSavingsPlusCurrentURL
          Carrier

        }
      }`;

    const query = {
      query: gql,
      variables: {
        memberId: clientId,
      },
    };

    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
    const result = await response.json();
    console.table(result.data);
  }
}

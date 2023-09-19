// Angular
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
      }
    });
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
          QRcode
          Group
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

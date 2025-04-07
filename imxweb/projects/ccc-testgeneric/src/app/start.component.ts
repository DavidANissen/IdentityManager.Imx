/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2024 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */

import { Component } from '@angular/core';
import { QerApiService } from 'qer';
import { TestGenericAppApiService } from './app-client.service';
import { PortalGenericCustomAll, V2ApiClientMethodFactory } from './TypedClient';

@Component({
  templateUrl: './start.component.html',
})
export class StartComponent {
  constructor(
    private qerApi: QerApiService,
    private testApi: TestGenericAppApiService
  ) {}

  private factory = new V2ApiClientMethodFactory();

  customEntries: PortalGenericCustomAll[] = [];
  totalCount = 0;
  busy = false;

  async loadCustomData() {
    try {
      this.busy = true;

      // load test data from a custom table using the protal/generic API.
      // This call uses the default parameters, which will
      // return the first 20 identities in the database.
      const customData = await this.testApi.typedClient.PortalGenericCustomAll.Get();

      this.customEntries = customData.Data;
      this.totalCount = customData.totalCount;
    } finally {
      // Even if the call fails, reset the busy flag
      this.busy = false;
    }
  }
}
/*
export class StartComponent {
  constructor(private qerApi: QerApiService) {}

  persons: PortalPersonAll[] = [];
  totalCount = 0;
  busy = false;

  async loadPersonData() {
    try {
      this.busy = true;

      // load some address book data from the API Server.
      // This call uses the default parameters, which will
      // return the first 20 identities in the database.
      const personData = await this.qerApi.typedClient.PortalPersonAll.Get();

      this.persons = personData.Data;
      this.totalCount = personData.totalCount;
    } finally {
      // Even if the call fails, reset the busy flag
      this.busy = false;
    }
  }
}
  */

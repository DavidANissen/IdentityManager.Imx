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

import {
  ApiClient,
  ApiRequestOptions,
  DisplayColumns,
  DisplayPattern,
  EntityCollectionData,
  EntitySchema,
  FilterData,
  FkCandidateBuilder,
  FkProviderItem,
  IReadValue,
  MethodDefinition,
  MethodDescriptor,
  MethodSchemaDto,
  StaticSchema,
  TimeZoneInfo,
  TypedEntity,
  TypedEntityBuilder,
  ValType
} from '@imx-modules/imx-qbm-dbts';


export class TypedClient {
  public readonly PortalGenericCustomAll: PortalGenericCustomAllWrapper;
  constructor(client: V2Client, translationProvider?) {
    this.PortalGenericCustomAll = new PortalGenericCustomAllWrapper(client, translationProvider);
  }
}


export class PortalGenericCustomAll extends TypedEntity {
  readonly XObjectKey: IReadValue<string> = this.GetEntityValue('XObjectKey');
  readonly Application: IReadValue<string> = this.GetEntityValue('CCC_Application');
  readonly RoleName: IReadValue<string> = this.GetEntityValue('CCC_RoleName');
  readonly Department: IReadValue<string> = this.GetEntityValue('CCC_Department');
  readonly Description: IReadValue<string> = this.GetEntityValue('CCC_Description');

  /** Returns the static compile time schema for this type. */
  static GetEntitySchema(): StaticSchema<'XObjectKey' | 'Application' | 'RoleName' | 'Department' | 'Description'> {
    const columns = {
      XObjectKey: {
        ColumnName: 'XObjectKey',
        Type: ValType.String,
        IsReadOnly: true,
      },
      Application: {
        ColumnName: 'CCC_Application',
        Type: ValType.String,
        IsReadOnly: true,
      },
      RoleName: {
        ColumnName: 'CCC_RoleName',
        Type: ValType.String,
        IsReadOnly: true,
      },
      Department: {
        ColumnName: 'CCC_Department',
        Type: ValType.String,
        IsReadOnly: true,
      },
      Description: {
        ColumnName: 'CCC_Description',
        Type: ValType.String,
        IsReadOnly: true,
      },
    };

    columns[DisplayColumns.DISPLAY_PROPERTYNAME] = DisplayColumns.DISPLAY_PROPERTY;
    columns[DisplayColumns.DISPLAY_LONG_PROPERTYNAME] = DisplayColumns.DISPLAY_PROPERTY_LONG;

    return { TypeName: 'CustomTable', Columns: columns };
  }
}

export class PortalGenericCustomAllWrapper {
  private builder: TypedEntityBuilder<PortalGenericCustomAll>;

  constructor(
    private readonly client: V2Client,
    private readonly translationProvider,
  ) {}

  private commitMethod;
  private deleteMethod;

  /** Returns the runtime schema for this method. */
  public GetSchema(): EntitySchema {
    return this.client.getSchema('portal/generic/{type}');
  }

  private buildBuilderIfNeeded(): void {
    if (!this.builder) {
      const fkProviderItems = this.client.getFkProviderItems('portal/generic/{type}');
      this.builder = new TypedEntityBuilder(
        PortalGenericCustomAll,
        fkProviderItems,
        this.commitMethod,
        this.translationProvider,
        this.deleteMethod,
      );
    }
  }

  async Get(parametersOptional: portal_generic_custom_all_get_args = {}, requestOpts: ApiRequestOptions = {}) {
    const data = await this.client.portal_generic_custom_all_get(parametersOptional, requestOpts);

    this.buildBuilderIfNeeded();

    return this.builder.buildReadWriteEntities(data, this.GetSchema());
  }
}

export interface portal_generic_custom_all_get_args {
  /** ORDER BY clause */ OrderBy?: string;
  /** Index of first entity to return */ StartIndex?: number;
  /** Number of entities to return */ PageSize?: number;
  /** Filter definition */ filter?: FilterData[];
  /** Comma-seperated list of properties to include in the result set. Prefix the list with the - character to exclude the default properties. */ withProperties?: string;
  /** Search term */ search?: string;
}

export class V2ApiClientMethodFactory {

  portal_generic_custom_all_get(
    options: portal_generic_custom_all_get_args = {},
    requestOptions: ApiRequestOptions = {},
  ): MethodDescriptor<EntityCollectionData> {
    return {
      path: '/portal/generic/CCCCustomTable',
      parameters: MethodDefinition.MakeQueryParameters(options, []),
      method: 'GET',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }
}

export class V2Client {
  private readonly methodFactory = new V2ApiClientMethodFactory();

  constructor(
    private readonly apiClient: ApiClient,
    private schemaProvider?: { readonly schemas: { [key: string]: EntitySchema } },
  ) {
    if (!apiClient) {
      throw new Error('The value for the apiClient parameter is undefined.');
    }
  }

  public get schemas(): { [key: string]: EntitySchema } {
    if (!this.schemaProvider) {
      throw new Error('The schema has not been loaded.');
    }
    return this.schemaProvider.schemas;
  }

  public async loadSchema(language?: string): Promise<void> {
    const headers = {};
    if (language) headers['Accept-Language'] = language;

    const dtos = (await this.apiClient.processRequest({
      path: '/imx/entityschema',
      parameters: [],
      method: 'GET',
      headers: headers,
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    })) as { [key: string]: MethodSchemaDto };

    const schemas: { [key: string]: EntitySchema } = {};

    for (var key in dtos) {
      const dto = dtos[key];
      const columns = dto.Properties ?? {};
      columns[DisplayColumns.DISPLAY_PROPERTYNAME] = DisplayColumns.DISPLAY_PROPERTY;
      columns[DisplayColumns.DISPLAY_LONG_PROPERTYNAME] = DisplayColumns.DISPLAY_PROPERTY_LONG;

      schemas[key] = {
        TypeName: dto.TypeName,
        DisplayPattern: new DisplayPattern(dto.DisplayPattern ?? ''),
        Display: dto.Display,
        DisplaySingular: dto.DisplaySingular,
        FkCandidateRoutes: dto.FkCandidateRoutes,
        Columns: columns,
      };
    }
    this.schemaProvider = { schemas: schemas };
  }

  public getFkProviderItems(methodKey: string): FkProviderItem[] {
    return new FkCandidateBuilder(this.getSchema(methodKey)?.FkCandidateRoutes ?? [], this.apiClient).build();
  }

  /** Returns the runtime schema for the named method. */
  public getSchema(methodKey: string): EntitySchema {
    const result = this.schemas[methodKey];
    if (!result) throw new Error('Unknown method: ' + methodKey);
    return result;
  }

  /** Returns a list of candidate objects from the table Person. */
  portal_generic_custom_all_get(
    options: portal_generic_custom_all_get_args = {},
    requestOptions: ApiRequestOptions = {},
  ): Promise<EntityCollectionData> {
    return this.apiClient.processRequest(this.methodFactory.portal_generic_custom_all_get(options), requestOptions);
  }
}

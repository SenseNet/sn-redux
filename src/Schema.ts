import { schema } from 'normalizr';

/**
 * This module is for defining Content and Collection schemas to normalize nested JSON response data in redux state store.
 *
 * Normalizr takes JSON and a schema and replaces nested entities with their IDs, gathering all entities in dictionaries.
 ** Entities can be nested inside other entities, objects and arrays;
 ** Combine entity schemas to express any kind of API response;
 ** Entities with same IDs are automatically merged (with a warning if they differ);
 ** Allows using a custom ID attribute (e.g. slug).
 *
 * Read more about normalizr [here](https://github.com/paularmstrong/normalizr)
 *
 * Since everything is a Content in sensenet ECM we're working with Content and collection of Content in most of the cases. So the sn-redux Schemas module defines the two
 * neccessarry main schema, content and arrayofContent to work with. This two schemas help you to normalize your JSON responses so that you can create a pure and flexible
 * client-side datasource.
 *
 * Example of normalizing the JSON response of a SenseNet OData Action for fetching Content as arrayOfContent schema which will create an entities object.
 * ```ts
 * export const receiveContent = (response: Content[], params: string) =>
 *  ({
 *      type: 'FETCH_CONTENT_SUCCESS',
 *      response: normalize(response, Schemas.arrayOfContent),
 *      params
 *  })
 * ```
 *
 * ![Normalized collection](http://download.sensenet.com/aniko/sn7/jsapidocs/img/normalized-collection.png)
 *
 * Example of normalizing the JSON response of a SenseNet OData Action for creating Content as content schema.
 * ```ts
 * export const createContentSuccess = (response: Content) =>
 *  ({
 *      type: 'CREATE_CONTENT_SUCCESS',
 *      response: normalize(response, Schemas.content)
 *  });
 * ```
 *
 * ![Normalized content](http://download.sensenet.com/aniko/sn7/jsapidocs/img/normalized-content.png)
*/
/**
 * Schema of a Content.
 *
 * It represents an item in the entities Object of the sn-redux store. The items are identified by the attribute 'Id'.
 */
export const contentItem = new schema.Entity('entities', {}, { idAttribute: 'Id' });
/**
 * Schema of a Collection.
 *
 * It represents the ```children``` object of the sn-redux store. It's a parent element of the Content items so it is defined as array of items with the schema content.
 */
export const arrayOfContent = new schema.Array(contentItem);

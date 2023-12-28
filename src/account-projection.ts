// import {  AccountStatus,  OperationType } from './account';
// import { AccountEvent } from './account-events';
// import { EventHandler } from './core';
// import { DocumentsCollection } from './core';
// // import {
// //   ShoppingCartDetails,
// //   ShoppingCartEvent,
// //   ShoppingCartShortInfo,
// //   ShoppingCartStatus,
// // } from './projections.solved.test';

// export const getAndStore = <T>(
//   collection: DocumentsCollection<T>,
//   id: string,
//   update: (document: T) => T
// ) => {
//   const document = collection.get(id) ?? ({} as T);

//   collection.store(id, update(document));
// };

// export type AccountDetails = {
//   accountId: string;
//   clientId: string;
//   accountLabel: string;
//   accountStatus: AccountStatus;
//   operations: OperationDetail[];
//   openingDate: Date;
//   closureDate: Date;
//   balance: number;
// };

// export type OperationDetail = {
//     operationDate: Date;
//     operationType: OperationType;
//     operationCategory: string;
//     operationLabel: string;
//     operationAmount: number;
// }

// export const AccountDetailsProjection = (
//   collection: DocumentsCollection<AccountDetails>
// ): EventHandler<AccountEvent> => {
//   return ({ type, data: event }: AccountEvent) => {
//     switch (type) {
//       case 'AccountOpened': {
//         collection.store(event.accountId, {
//             accountId: event.accountId,
//             accountLabel: event.accountLabel,
//             clientId: event.clientId,
//             openingDate: event.accountOpeningDate,
//             accountStatus: AccountStatus.Opened,
//             operations: [],
//             balance: 0,
//             closureDate: undefined!
//         });
//         return;
//       }
//       case 'AccountCredited': {
//         getAndStore(collection, event.accountId, (document) => {
//           document.operations.push(
//             {
//                 operationAmount: event.operationAmount,
//                 operationCategory: event.operationCategory,
//                 operationDate: event.operationDate,
//                 operationLabel: event.operationLabel,
//                 operationType : event.operationType
//             }
//           );
//           document.balance += event.operationAmount;
//           return document;
//         });
//         return;
//       }
//       case 'AccountDebited': {
//         getAndStore(collection, event.accountId, (document) => {
//             document.operations.push(event);
//             document.balance += event.operationAmount;
//             return document;
//         });
//         return;
//       }
//       case 'AccountClosed': {
//         getAndStore(collection, event.accountId, (document) => {
//           document.accountStatus = AccountStatus.Closed;
//           document.closureDate = event.accountClosureDate;

//           return document;
//         });
//         return;
//       }
//       default: {
//         return;
//       }
//     }
//   };
// };

// // export const ShoppingCartShortInfoProjection = (
// //   collection: DocumentsCollection<ShoppingCartShortInfo>
// // ): EventHandler<ShoppingCartEvent> => {
// //   return ({ type, data: event }) => {
// //     switch (type) {
// //       case 'ShoppingCartOpened': {
// //         collection.store(event.shoppingCartId, {
// //           id: event.shoppingCartId,
// //           clientId: event.clientId,
// //           totalAmount: 0,
// //           totalItemsCount: 0,
// //         });
// //         return;
// //       }
// //       case 'ProductItemAddedToShoppingCart': {
// //         getAndStore(collection, event.shoppingCartId, (document) => {
// //           const { productItem } = event;

// //           document.totalAmount += productItem.quantity * productItem.unitPrice;
// //           document.totalItemsCount += productItem.quantity;

// //           return document;
// //         });
// //         return;
// //       }
// //       case 'ProductItemRemovedFromShoppingCart': {
// //         getAndStore(collection, event.shoppingCartId, (document) => {
// //           const { productItem } = event;

// //           document.totalAmount -= productItem.quantity * productItem.unitPrice;
// //           document.totalItemsCount -= productItem.quantity;

// //           return document;
// //         });
// //         return;
// //       }
// //       case 'ShoppingCartConfirmed': {
// //         collection.delete(event.shoppingCartId);
// //         return;
// //       }
// //       case 'ShoppingCartCanceled': {
// //         collection.delete(event.shoppingCartId);
// //         return;
// //       }
// //     }
// //   };
// // };
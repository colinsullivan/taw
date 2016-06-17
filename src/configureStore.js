/**
 *  @file       configureStore.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { createStore, applyMiddleware } from "redux"

import rootReducer from "./reducers.js"

/**
 *  logging of state-store messages
 **/
const logger = store => next => action => {
  let now = new Date();
  //console.group(action.type)
  console.info(`${now.toString()}: [TAW] dispatching`, action);
  //let result = next(action)
  //console.log('next state', JSON.stringify(store.getState()))
  //console.groupEnd(action.type)
  //return result
  return next(action);
};

export default function configureStore () {
  let createStoreWithMiddleware = applyMiddleware(
    //forwardToSC,
    logger
  )(createStore);


  return createStoreWithMiddleware(rootReducer);
}


/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var db = ripple('db'),
    constants = ripple('constants'),
    LOCAL_PROXY_PORT_SETTING = constants.XHR.LOCAL_PROXY_PORT_SETTING,
    LOCAL_PROXY_ROUTE_SETTING = constants.XHR.LOCAL_PROXY_ROUTE_SETTING,
    PROXY_SETTING = constants.XHR.PROXY_SETTING;

function saveAndReload(key, value) {
    jWorkflow.order(function (prev, baton) {
        baton.take();
        db.save(key, value, null, baton.pass);
    }).start(function () {
        location.reload();
    });
}

function getSettings() {
    console.log("Proxy port: " + db.retrieve(PROXY_SETTING));
    return {
        proxy: db.retrieve(PROXY_SETTING),
        localProxyPort: db.retrieve(LOCAL_PROXY_PORT_SETTING),
        localProxyRoute: db.retrieve(LOCAL_PROXY_ROUTE_SETTING)
    };
}

module.exports = {
    saveAndReload: saveAndReload,
    getSettings: getSettings
};

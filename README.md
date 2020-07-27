# pvea
pvea (pronounced pea-va) is a modern and up-to-date node.js client for the proxmox api.

###### [Proxmox API wiki.](https://pve.proxmox.com/wiki/Proxmox_VE_API)
###### [Proxmox API documentation.](https://pve.proxmox.com/pve-docs/api-viewer/index.html)

## Installation:

  `npm i pvea` or  `yarn add pvea`.


## To-Do List:

- [X] Basic functionality.
    - [X] Authenticate with Proxmox VE API.
    - [X] Check if authentication token is expired.
    - [X] Get api version.

- [X] storage
    - [X] getStorage(param)
    - [X] createStorage(param)
    - [X] getStorageConfig(storage)
    - [X] deleteStorageConfig(storage, param)
    - [X] getStorageStatus(node, storage)
    - [X] getStorageRrdData(node, storage, param)
    - [X] getStorageContent(node, storage, param)
    - [X] allocateDiskImage(node, storage, param)
    - [X] getVolumeAttributes(node, storage, volume, param)
    - [X] deleteVolume(node, storage, volume, param)
    - [X] createBackup(node, param)
    - [X] getBackupConfig(node, param)

- [X] pools
    - [X] getPools()
    - [X] getPoolConfig(poolid)
    - [X] deletePoolConfig(poolid)
    - [X] updatePoolConfig(poolid, param)

- [X] nodes
    - [X] getNodes()
    - [X] wakeNode(node)
    - [X] getNodeVersion(node)
    - [X] getNodeTime(node)
    - [X] updateNodeTimeZone(node, param)
    - [X] getNodeLog(node, param)
    - [X] getNodeSubscriptionStatus(node)
    - [X] deleteNodeSubscriptionKey(node)
    - [X] setNodeSubscriptionKey(node)
    - [X] updateNodeSubscriptionKey(node)
    - [X] stopAll(node, param)
    - [X] getNodeStatus(node)
    - [X] rebootNode(node)
    - [X] shutdownNode(node)
    - [X] startAll(node, param)
    - [X] getNodeRrdData(node)
    - [X] getNodeReport(node)
    - [X] getNodeNetstat(node)
    - [X] migrateAll(node, param)
    - [X] getNodeJournal(node, param)
    - [X] getNodeHostname(node)
    - [X] setNodeHostname(node, param)
    - [X] getNodeDnsSettings(node)
    - [X] setNodeDnsSettings(node, param)
    - [X] listNodeCpu(node)
    - [X] getNodeConfig(node, param)
    - [X] updateNodeConfig(node, param)
    - [X] getNodeAplInfo(node)


- [X] tasks
    - [X] getNodeTasks(node, param)
    - [X] stopTask(node, upid)
    - [X] getTaskLog(node, upid, param)
    - [X] getTaskStatus(node, upid)

- [X] services
    - [X] reloadService(node, service)
    - [X] restartService(node, service)
    - [X] startService(node, service)
    - [X] stopService(node, service)
    - [X] getServiceState(node, service)
    - [X] listServices(node)

- [X] lxc
    - [X] listLxcContainers(node)
    - [X] createLxcContainer(node, param)
    - [X] createLxcTemplate(node, vmid)
    - [X] getLxcRRDData(node, vmid, param)
    - [X] resizeLxcContainer(node, vmid, param)
    - [X] getLxcPending(node, vmid)
    - [X] getLxcConfig(node, vmid)
    - [X] cloneLxcContainer(node, vmid, param)
    - [X] suspendLxcContainer(node, vmid)
    - [X] stopLxcContainer(node, vmid)
    - [X] resumeLxcContainer(node, vmid)
    - [X] rebootLxcContainer(node, vmid)
    - [X] getLxcContainerStatus(node, vmid)
    - [X] deleteLxcContainer(node, vmid, param)

- [ ] Write documentation for this library.

## Example:

    // pvea library.
    const pveajs = require("pvea")

    // create a new instance, you can use this to connect to multiple nodes if you want.
    const pvea = new pveajs('hostname', 'user@auth', 'password')

    // our main application.
    async function main() {
        // get version of proxmox API.
        pvea.apiVersion().then( res => {
            // log result.
            console.log(res)
        })
    }

    // execute the application.
    pvea.run(main)


## Main contributors
As of now, [Ami](https://github.com/AmiCole) is the only main contributor.


## Notes
Thanks to [ttarvis](https://github.com/ttarvis) for writing [node-proxmox](https://github.com/ttarvis/node-proxmox)! Code was used for reference and function names are taken from it. Also thanks to [alo-is](https://github.com/alo-is) for writing another module also called [node-proxmox](https://github.com/alo-is/node-proxmox).

## License

Copyright 2020 Ami Cole

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

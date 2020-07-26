# pvea
pvea (pronounced pea-va) is a node.js client for the proxmox api. primarily focused on LXC containers functionality, but is still feature-packed.

###### [Proxmox API wiki.](https://pve.proxmox.com/wiki/Proxmox_VE_API)
###### [Proxmox API documentation.](https://pve.proxmox.com/pve-docs/api-viewer/index.html)

## Installation:
  // npm. 
  npm i pvea
  // yarn.
  yarn add pvea


## To-Do List:

- [X] Core functionality.
    - [X] Authenticate with Proxmox VE API.
    - [X] Check if authentication token is expired.
    - [X] Get version.
    - [X] Get nodes.
    - [X] Get node version.
    - [X] Get node time.
    - [X] Get node log.
    - [X] Get node tasks.
    - [X] Get node status.
    - [X] Get node subscription.
    - [X] Get node report.
    - [X] Get node netstat.
    - [X] Get node journal.
    - [X] Get node hosts.
    - [X] Get node dns.
    - [X] Get node config.
    - [X] Get node aplinfo.

- [ ]  Core LXC Container Functionality. (Priority)
    - [X] Create LXC container.
    - [X] Shutdown LXC container.
    - [X] Start LXC container.
    - [X] Stop LXC container.
    - [X] Mount LXC container.
    - [X] Unmount LXC container.
    - [ ] Finish other LXC container related things.


- [ ] Firewall functionality.
    - [ ] List firewalls.
    - [ ] List firewall rules.
    - [ ] Create firewall rule.
    - [ ] Get firewall rule.
    - [ ] Update firewall rule.

- [ ] Write documentation for this library.

## Example:
    // pvea library.
    const pvea = require("pvea")

    // create a new instance, you can use this to connect to multiple nodes if you want.
    const pveaInstance = new pvea('hostname', 'user@auth', 'password')

    // our main application.
    async function main() {
        // get version of proxmox API.
        pveaInstance.getVersion().then( res => {
            // log result.
            console.log(res)
        })
    }

    // execute the application.
    pveaInstance.run(main)


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

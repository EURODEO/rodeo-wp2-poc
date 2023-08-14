# rodeo-wp2-poc

Rodeo work package 2 POC

### Gravitee

Gravitee file structure:

```
/gravitee
 ├── apim-gateway
 │    ├── logs
 │    └── plugins
 ├── apim-management-api
 │    ├── logs
 │    └── plugins
 ├── apim-management-ui
 │    └── logs
 ├── apim-portal-ui
 │    └── logs
 ├── elasticsearch
 │    └── data
 ├── installation
 └── mongodb
     └── data
```

It can be generated by command:

```
mkdir -p /gravitee/{mongodb/data,elasticsearch/data,apim-gateway/plugins,apim-gateway/logs,apim-management-api/plugins,apim-management-api/logs,apim-management-ui/logs,apim-portal-ui/logs,installation}
```

# updateBookkit

script for updating bookkit pages

## Prerequisites

1. Bookkit must have uu5DataMap in use. As this is only way how update pages. Navigate to Page -> update uu5datamap -> place json:
    ```json
    {
      "table1": {
        "data": [
          ["Environment","subapp1","subapp2","subapp3"],
          ["dev","1.2.3 (2.2.2021)", "22 (19.08.2021 15:2)", "1.2.3 (2.2.2022)" ],
          ["test","42 (19.08.2021 14:37)","1.2.3 (2.2.2021)","1.2.3 (2.2.2022)"]
        ]
      }
    }
    ```   
2. Bookkit page should have table configured with uu string: 
    ```xml
      <uu5string/><UuContentKit.Tables.Table rowHeader colHeader=false header="Do not update this page!!!" data="<uu5data/>table1.data"/>
    ```  
 
## How to run

```javascript
npm install 
node src/updateBookkit.js bookKitUrl pageCode environment subApplication version pathToPasswordFile
```

example: 
```javascript
node src/updateBookkit.js https://uuapp.plus4u.net/uu-bookkit-maing01/1111111 123 dev subapp2 1.2.3 /tmp/passwordFile
```




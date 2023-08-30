Library uom-ts
==============

A typescript library for units of measurement



# Testing the library
To run the fast check tests:
```
npm run test
```
or on Windows command:
```
for ($i=1; $i -le 10; $i++) {echo $i; npm run test}
```

Adjust the configuration in the `fc.configureGlobal` call.

# Build the library

```
npm run build
npm pack
```

Update the version in `package.json` if necessary.

# Versioning and deployment

Twee relevante directories:
- npm in AppData/Roaming
- npm-cache AppData/Local

De eerste is de global node_modules, en de tweede is npm's cache.

Link/unlink en global install van uom-ts gaat via de roaming npm directory. Gaat uom-ts ook via de cache?

Het lijkt dat als een versie eenmaal gebruikt is, dat een update van het package niet lijkt te werken. De 
package lock in het gebruikende package (pct-front) houdt de sha van het uom-ts package. Blocked die de update?
Of is het de npm cache?

TODO: uitzoeken hoe deployment te doen. Voor nu:
1. verhoog versie nummer
2. do npm run build
3. do npm pack
4. gebruikt de nieuwe versie




Zie https://sebhastian.com/npm-clear-cache/

C:\Users\HP\Documents\code\uom-ts>npm cache verify
Cache verified and compressed (~\AppData\Local\npm-cache\_cacache)
Content verified: 6048 (653140505 bytes)
Content garbage-collected: 708 (135498136 bytes)
Index entries: 6049
Finished in 55.844s
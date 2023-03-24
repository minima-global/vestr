version=$(node getVersion.js)

cd src && zip -r vestr-src-${version}.mds.zip . && mv vestr-src-${version}.mds.zip ../
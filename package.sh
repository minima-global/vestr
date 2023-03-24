version=$(node getVersion.js)

cd build && zip -r vestr-${version}.mds.zip . && mv vestr-${version}.mds.zip ../
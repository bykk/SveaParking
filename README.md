# SveaParking
Svea parking application 

# Deployment
Step 1: ionic cordova plugin rm cordova-plugin-console <br/>
Step 2: ionic cordova build --release android <br/>
Step 3: Navigate platforms/android/app/build/outputs/apk and run:  keytool -genkey -v -keystore svea-parking-key.keystore -alias SveaParking -keyalg RSA -keysize 2048 -validity 10000, if you got key previously skip this step <br/>
Step 4: jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore svea-parking-key.keystore release/app-release-unsigned.apk SveaParking <br/>

# Resources
RUN: ionic cordova resource, to refresh for example splash screen or icon

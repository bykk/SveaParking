# SveaParking
Svea parking application 

# Deployment
Step 1: ionic cordova plugin rm cordova-plugin-console
Step 2: ionic cordova build --release android
Step 3: Navigate platforms/android/app/build/outputs/apk and run:  keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000, if you got key previously skip this step
Step 4: jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore svea-parking-app-unsigned.apk SveaParking
Step 5: zipalign not ready yet

# Resources
RUN: ionic cordova resource, to refresh for example splash screen or icon

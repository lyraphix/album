# Features I'd like:

## aesthetics 
  - deliver nicer aesthetic and at least 2 albums fast so that I can use it to show silk guys
  - mobile experience should be considered!
    
## albums!
  - album name in top left
  - need an album create page. main page can just be my default album (everything).
    - album create page: album name and album password.
  - STRETCH GOAL: remix albums. so create albums of other peoples shit. like a select toggle button near top right. 
  - main page allows you to type in your album name. once there you can upload to it.
    - there needs to be a way so that only you can upload to an album. or everyone can upload to it.
    - password protecting albums would also be interesting. not only for privacy but also for uploading.
  - need to fix up the image bucket lmao. get main images out of root, create album folders with hi/low-res subfolders.
  - albums should show most recent images first
  - image display is a bit wonky (full stretch lmao.) its cute tho.
    - i like the idea of adding someeee tooling on the right--like the ability to click on the albums that image belongs to, and also maybe toggle between wide screen and true dimensions.
      
## image conversions
  - should all be jpg, 1 hi-res, 1 low-res.
  - need to validate uploads (should exclusively be images)

## uploads!!
  - upload button should be in top right or something.
  - uploading needs to be conducive to many uploads. and progress bar (ascii???) instead of error. and image by image. so people can understand how their upload is coming along
    

# productionize! (get ready to put qr codes around ny)
## marketing
  - flyers for this would go hard literally just a screenshot of the main page
  - i want a Bunch of people to upload just an insane amount of images

## security
  - big security shit. like i need to ENSURE people abusing uploads (spam/high volume/inappropriate content) are banned beeg time.
  - i like phone number sms verification. tie every upload to a number. this combined with ip would be good. make a map of every ip/phone-number combo. if a phone number gets banned every ip tied to it gets banned.
  - add some observability.
  - aws rekognition is a solution apparently!

## cost
  - price out 20 users, 200 users
  - look into webp/alternative cheapo hosting.
  - add limits to protect for cost.
  - CDN, s3 lambda functions.

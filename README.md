# listing

### Step 1.
1. Copy this url ``https://github.com/avi9984/listing.git`` and use git clone this url and  paste it in your terminal to download the repository. Or download zip file then use.


### Step 2.
1. Add ``.env`` file  to the root directory of your project. 
2. Then use command is ``npm i`` .
3. After that use command is ``npm start`` 


## Routes
### User Routes
#### 1. Resgiter the user use api ``{{server}}/users/register``
- Method: POST
#### 2. Login user use api ``{{server}}/users/login``
- Method: POST
#### 3. Logout user with token
- Use url : ``{{server}}/users/logout`` + token
- Method: POST
#### 4. Update user profile with authentication
- Method: PUT
- Use url :``{{server}}/users/updateProfile``
#### 5. Get user details with authentication
- Method: GET
- Use url : ``{{server}}/users/userDetails``

### Listing Routes
#### 1. Create new listing with only the admin and vendors
- Method: POST
- Use url : ``{{server}}/listing/createListing``
#### 2. Get all listing for public api and also use authenitcation api
- Method: GET
- Use url : ``{{server}}/listing/getAllListing``
- Use url : ``{{server}}/listing/verifiedGetAllListing`` + token its private api
####  3. Get single listing by id
- Method: GET
- Use url: ``{{server}}/listing/getListById/:listingId``

#### 4. Edit a listing with authentication update only vendors and admin
- Method:PUT
- Use url: ``{{server}}/listing/update/:listingId`` + token
#### 5. Delete a listing with authentication delete only vendors and admin
- Method: DELETE
- Use url: ``{{server}}/listing/delete/:listingId`` + token

### Review Routes
#### 1. Add review to any listing from any user and admin condition is user is logged in
- Method: POST
- Use url : ``{{server}}/review/createReview`` +token
#### 2. Get all review for public
- Method: GET
- Use url : ``{{server}}/review/getAllReviews``
#### 3. Get single review by review Id
- Method:GET
- Use url : ``{{server}}/review/getReviewById/:reviewId`` 
#### 4. Update review by review owner or admin and vendors only give the responce
- Method:PUT
- Use url : ``{{server}}/review/update/:reviewId`` + token
#### 5. Delete review by owner 
- Method:DELETE
- Use url : ``{{server}}/review/delete/:reviewId``


## use {{server}}=== http://localhost:5000/api/v1




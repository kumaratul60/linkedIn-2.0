1. `$addToSet`: Adds a value to an array unless the value is already present, ensuring no duplicates.
    - _Why Used: To ensure unique values in an array field, preventing duplicates._

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  hobbies: [String]
});

const User = mongoose.model('User', userSchema);

User.updateOne(
  { name: 'John' },
  { $addToSet: { hobbies: 'reading' } }
).exec();
```

2.  `$pull`: Removes all instances of a value from an array.
    - Why Used: To remove specific values from an array field, cleaning up unnecessary or unwanted entries.

```js
User.updateOne(
  { name: 'John' },
  { $pull: { hobbies: 'reading' } }
).exec();
```

3. `save`: Saves a document to the database. If the document is new, it inserts it. Otherwise, it updates the existing document.
    - Why Used: To persist changes or new data to the MongoDB database.

 ```js
 const user = new User({ name: 'John', hobbies: ['reading', 'gaming'] });
user.save((err) => {
  if (err) console.error(err);
  console.log('User saved successfully');
});
```

4. `populate`: Replaces the specified paths in the document with documents from other collections.
    - Why Used: To perform joins and retrieve related documents, making data more meaningful and reducing the need for multiple queries.

```js
const bookSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Book = mongoose.model('Book', bookSchema);

Book.find()
  .populate('author')
  .exec((err, books) => {
    if (err) console.error(err);
    console.log(books);
  });
```

5. `lean`: Returns plain JavaScript objects instead of Mongoose documents, which reduces overhead.
    - Why Used: To improve performance by bypassing Mongoose document methods and just getting plain JavaScript objects.

```js
Book.find().lean().exec((err, books) => {
  if (err) console.error(err);
  console.log(books);
});
```

6. `create`:Creates one or more new documents and saves them to the database. It is a shorthand for
```new Model(doc).save().```
    - Why Used: To insert new documents into the collection. This is useful for adding new records to the database efficiently.

```js
// Create a single document
// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
const userSchema = new Schema({
  name: String,
  age: Number
});

// Create a model
const User = mongoose.model('User', userSchema);

// Create a single document
User.create({ name: 'Jane', age: 28 }, (err, user) => {
  if (err) console.error(err);
  console.log('User created:', user);
});

// Create multiple documents
User.create(
  [
    { name: 'Alice', age: 23 },
    { name: 'Bob', age: 34 }
  ],
  (err, users) => {
    if (err) console.error(err);
    console.log('Users created:', users);
  }
);
```
7. `insertMany`: Inserts multiple documents into the collection in a single operation. This is more efficient for bulk inserts.

```js
// Insert multiple documents
User.insertMany(
  [
    { name: 'Alice', age: 23 },
    { name: 'Bob', age: 34 },
    { name: 'Charlie', age: 45 }
  ],
  (err, users) => {
    if (err) console.error(err);
    console.log('Users inserted:', users);
  }
);
```

8. `remove`: Deletes documents from the collection based on specified criteria. It can remove multiple documents if multiple documents match the criteria.

    -  To delete documents from the collection based on specified conditions. This is useful for cleaning up data or removing obsolete records.

```js
// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
const userSchema = new Schema({
  name: String,
  age: Number
});

// Create a model
const User = mongoose.model('User', userSchema);

// Remove documents where the age is less than 18
User.remove({ age: { $lt: 18 } }).exec((err) => {
  if (err) console.error(err);
  console.log('Users under 18 removed successfully');
});
```
    - To delete multiple documents based on a condition.
    - remove is an older method and its use is generally discouraged in favor of the newer delete methods.

9. `deleteOne`: Deletes a single document that matches the specified criteria.
    - To delete a single document based on a condition.
    - Provides more explicit and clear semantics for deleting a single document.

```js
// Delete a single document where the name is 'John'
User.deleteOne({ name: 'John' }).exec((err) => {
  if (err) console.error(err);
  console.log('User named John deleted successfully');
});
```

10. `deleteMany`: Deletes multiple documents that match the specified criteria.

    - To delete multiple documents based on a condition.
    - Provides more explicit and clear semantics for deleting multiple documents.

```js
// Delete all documents where the age is less than 18
User.deleteMany({ age: { $lt: 18 } }).exec((err) => {
  if (err) console.error(err);
  console.log('Users under 18 deleted successfully');
});

```

11. Examples:

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for users
const userSchema = new Schema({
  name: String,
  age: Number,
  email: String,
  hobbies: [String],
  address: { type: Schema.Types.ObjectId, ref: 'Address' } // Reference to Address schema for population
});

// Define a schema for addresses
const addressSchema = new Schema({
  street: String,
  city: String,
  zipCode: String
});

// Create models
const User = mongoose.model('User', userSchema);
const Address = mongoose.model('Address', addressSchema);

// Create new documents
async function createDocuments() {
  // Create a new address document
  const address = await Address.create({ street: '123 Main St', city: 'Anytown', zipCode: '12345' });

  // Create a new user document and link it to the created address
  const user = await User.create({ name: 'John Doe', age: 25, email: 'john@example.com', hobbies: ['reading', 'sports'], address: address._id });

  console.log('Created user:', user);
}

// Find documents with lean
async function findDocuments() {
  // Find all user documents and return plain JavaScript objects
  const users = await User.find().lean().exec();
  // .lean() is used to return plain JavaScript objects instead of Mongoose documents, which is faster and uses less memory
  // .exec() executes the query and returns a promise
  console.log('Found users:', users);
}

// Update documents with updateOne and updateMany
async function updateDocuments() {
  // Update one document where the name is 'John Doe'
  const updateOneResult = await User.updateOne({ name: 'John Doe' }, { $set: { age: 26 } }).exec();
  // $set operator sets the value of a field in the document
  console.log('UpdateOne result:', updateOneResult);

  // Update many documents where the age is less than 18
  const updateManyResult = await User.updateMany({ age: { $lt: 18 } }, { $set: { age: 18 } }).exec();
  // $lt operator is a query condition that stands for "less than"
  console.log('UpdateMany result:', updateManyResult);
}

// Delete documents with deleteOne and deleteMany
async function deleteDocuments() {
  // Delete one document where the name is 'John Doe'
  const deleteOneResult = await User.deleteOne({ name: 'John Doe' }).exec();
  console.log('DeleteOne result:', deleteOneResult);

  // Delete many documents where the age is less than 18
  const deleteManyResult = await User.deleteMany({ age: { $lt: 18 } }).exec();
  console.log('DeleteMany result:', deleteManyResult);
}

// Add to set and pull from array
async function modifyArrayFields() {
  // Find one user document where the name is 'John Doe'
  const user = await User.findOne({ name: 'John Doe' }).exec();
  // findOne() retrieves a single document that matches the query
  console.log('Original user hobbies:', user.hobbies);

  // Add 'gaming' to hobbies array if it doesn't already exist
  user.hobbies.$addToSet('gaming'); // $addToSet operator adds a value to an array unless the value is already present
  await user.save();
  console.log('Updated user hobbies (after $addToSet):', user.hobbies);

  // Remove 'reading' from hobbies array
  user.hobbies.$pull('reading'); // $pull operator removes all instances of a value from an array
  await user.save();
  console.log('Updated user hobbies (after $pull):', user.hobbies);
}

// Populate references
async function populateReferences() {
  // Find one user document where the name is 'John Doe' and populate the address field
  const user = await User.findOne({ name: 'John Doe' }).populate('address').exec();
  // populate() replaces the specified field(s) with documents from the referenced collection
  console.log('Populated user with address:', user);
}

// Main function to run all operations
async function main() {
  try {
    await createDocuments(); // Create documents in the database
    await findDocuments(); // Find and log documents
    await updateDocuments(); // Update documents and log results
    await deleteDocuments(); // Delete documents and log results
    await modifyArrayFields(); // Modify array fields in a document and log results
    await populateReferences(); // Populate references in a document and log results
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

main();
```

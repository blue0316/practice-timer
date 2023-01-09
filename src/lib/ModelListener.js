
class ModelListener {
  static listenForSingleValue(ref, transformer, callback) {
    ref.on('value', (dataSnapshot) => {
      dataSnapshot.forEach(function(child) {
            console.log(child.val()) // NOW THE CHILDREN PRINT IN ORDER
      });
      if (dataSnapshot.val()) {
        let deserializedValue = transformer(dataSnapshot.val(), dataSnapshot.key)
        callback(deserializedValue)
      }
    });
  }


  static listenForMultipleValues(ref, transformer, callback) {
    ref.on('value', (dataSnapshot) => {
      let arr = [];
      dataSnapshot.forEach((child) => {
        arr.push(transformer(child.val(), child.key));
      })
      callback(arr)
    });
  }

  static listenForMultipleOrderedValues(ref, transformer, callback) {
    ref.on('value', (dataSnapshot) => {
      let arr = [];
      dataSnapshot.forEach((child) => {
        arr.push(transformer(child.val(), child.key, child.val().index));
      })
      callback(arr)
    });
  }

  static listenForMultipleValuesByKey(ref, transformer, callback) {
    ref.on('value', (dataSnapshot) => {
      let dict = {};

      if (dataSnapshot.val() != null) {
        console.log('LISTEN MULTIPLE VALUE BY KEY SECTIONS UPDATES:', dataSnapshot.val())
        dataSnapshot.forEach((child) => {
          dict[child.key] = transformer(child.val(), child.key);
        })
        callback(dict)
      }
      callback(null)
    });
  }
}

export default ModelListener

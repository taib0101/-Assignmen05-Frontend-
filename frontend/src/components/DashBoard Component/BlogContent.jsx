import { useState, memo, useCallback, useEffect, useContext } from "react";
import CRUDForm from "./CRUDForm";
import { MenuContext } from "../../App";

const BlogContent = () => {
  let [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState({
    formClicked: false,
    addUpdate: "",
    formValue: {}
  });
  const menuContextValue = useContext(MenuContext);

  const readBlog = useCallback(async () => {
    try {
      if (menuContextValue.authentication.login) {
        const url = `${menuContextValue.url}/read/blog?username=${menuContextValue.authentication.username}`;
        const payload = {
          method: "get",
        };
        const response = await fetch(url, payload);
        const fetchedData = await response.json();

        // console.log("fetched data :", fetchedData);
        if (fetchedData.status === "error")
          throw new Error(fetchedData.description);

        console.log("fecthed array :", fetchedData.array);
        setItems(fetchedData.array);
      } else {
        setItems([
          {
            name: "Item 1",
            description: "Description 1",
          },
          { name: "Item 2", description: "Description 2" },
        ]);
      }
    } catch (error) {
      window.alert(error.message);
    }
  }, [menuContextValue.authentication]);

  useEffect(() => {
    readBlog();
  }, [readBlog])
  // console.log("user name :", menuContextValue);

  // console.log("team id :", items[0]);

  const updateItem = useCallback((id, name, description) => {
    console.log("update this bro");
    setShowForm({
      formClicked: true,
      addUpdate: "Update",
      formValue: {
        id,
        name,
        description
      }
    });
  }, [setShowForm]);

  const deleteItem = async (id) => {
    console.log("delete this bro");

    try {
      const url = `${menuContextValue.url}/delete/blog/${id}?username=${menuContextValue.authentication.username}`;
        const payload = {
          method: "get",
        };
        const response = await fetch(url, payload);
        const fetchedData = await response.json();

        // console.log("fetched data :", fetchedData);
        if (fetchedData.status === "error")
          throw new Error(fetchedData.description);

        readBlog();
    } catch (error) {
      window.alert(error.message);
    }
  };

  const addItem = useCallback(
    (event) => {
      // console.log("add bro");
      setShowForm({
        formClicked: true,
        addUpdate: "Add",
        formValue: {}
      });
    },
    [setShowForm]
  );

  return (
    <div className={`container mx-auto p-4`}>
      <CRUDForm showFormObject={{ showForm, setShowForm }} content={"Blog"} readData={readBlog} />
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
        <div className={`p-4 border rounded-lg shadow-lg`}>
          <h2 className={`text-lg font-semibold mb-2`}>Blog Content</h2>
          <div className={`space-y-4`}>
            <div className={`p-4 border rounded-lg shadow`}>
              {items.map((item, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-2`}>
                  <div>
                    <h3 className={`font-bold break-words`}>{item.name}</h3>
                    <p className={`text-sm text-gray-600 break-words`}>
                      {item.description}
                    </p>
                  </div>
                  <div className={`flex items-center justify-center gap-2`}>
                    <button
                      onClick={() => updateItem(item._id, item.name, item.description)}
                      className={`bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mr-2 h-fit`}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-fit`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4">Add New Blog</h2>
          <button
            onClick={addItem}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
          >
            + Add Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(BlogContent);

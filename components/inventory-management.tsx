'use client';
import { useEffect, useState } from "react";
import { DeleteInventoryItem, SaveInventoryItem } from "@/app/(admin)/actions";
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";



export default function InventoryManagement({ inventory }: { inventory: any[] }) {
    const [inventoryList, setInventoryList] = useState(inventory);
    const [alertMessage, setAlertMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertColor, setAlertColor] = useState("green");
    const [editing, toggleEditing] = useState(false);
    const [editingItem, setEditingItem] = useState({id: 0, name: "", description: "", price: 0, photo: "", count: 0});
    const [newPhoto, setNewPhoto] = useState("");

        useEffect(() => {
            if (alertMessage) {
                setAlert(true);
                const timer = setTimeout(() => {
                    setAlert(false);
                    setAlertMessage("");
                    window.location.reload()
                }, 3000);
                return () => clearTimeout(timer);
            }
        }, [alertMessage]);

    async function handleDelete(itemId: number, photoDelete: string) {
        const response = await DeleteInventoryItem(itemId);
        if(response.success){
            deletePhoto(photoDelete);
            setAlertMessage(response.message);
            setAlert(true);
            setAlertColor("bg-green-500");
            setInventoryList(response.inventory!)
        } else{
            setAlertMessage(response.message);
            setAlert(true);
            setAlertColor("bg-red-500");
        }
    }

    function handleEdit(itemId: number) {
        toggleEditing(true);
        const itemToEdit = inventoryList.find(item => item.id === itemId);
        if (itemToEdit) {
            setEditingItem(itemToEdit);
        }
    }

    function cancelEdit(){
        if(newPhoto != ""){
            deletePhoto(newPhoto);
            setEditingItem({id: 0, name: "", description: "", price: 0, photo: "", count: 0});
            setNewPhoto("")
        }
        setAlertMessage("Cancelled Editing...");
        setAlert(true);
        setAlertColor("bg-amber-500");
    }

    function saveEdit(){
        if(newPhoto != ""){
            deletePhoto(editingItem.photo);
            SaveInventoryItem(editingItem.id, editingItem.name, editingItem.description, editingItem.price, newPhoto, editingItem.count);
        } else{
            SaveInventoryItem(editingItem.id, editingItem.name, editingItem.description, editingItem.price, editingItem.photo, editingItem.count);
        }
        setAlertMessage("Item Edits Saved!");
        setAlert(true);
        setAlertColor("bg-green-500");
        setNewPhoto("");
    }

    async function deletePhoto(incomingPhoto: string) {
        if(incomingPhoto){
            try {
                await fetch("/api/delete-photo", {
                    method: "POST",
                    body: JSON.stringify({ publicId: incomingPhoto }),
                });
                console.log("Deleted:", incomingPhoto);
            } catch (err) {
                console.error("Could not delete old photo", err);
            }            
        } else{
            setAlertMessage("No photo to delete.");
            setAlert(true);
            setAlertColor("bg-red-500");
        }

    }        

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full md:p-5 gap-5 overflow-y-scroll inner-scrollbar">
                {inventoryList.map((item) => (
                    <div key={item.id} className="border border-(--secondary-color) rounded-md p-4 flex flex-col place-items-center gap-2">
                        <h3 className="text-2xl font-medium">{item.name}</h3>
                        <p><strong className="text-purple-500">Price:</strong> ${item.price}</p>
                        <p><strong className="text-purple-500">Available:</strong> {item.count} units</p>
                        <CldImage src={item.photo} alt={item.name} width={300} height={200} className="object-cover rounded-md" />
                        <div className="flex flex-nowrap gap-5">
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md w-fit self-center"
                            onClick={() => {toggleEditing(true); handleEdit(item.id)}}>
                                Edit
                            </button>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-fit self-center"
                            onClick={() => handleDelete(item.id, item.photo)}>
                                🗑️
                            </button>   
                        </div>
                    </div>
                ))}
                {alert && (
                    <div className={`fixed top-15 place-self-center ${alertColor} text-white text-4xl px-4 py-2 rounded-md shadow-lg animate-fade-down animate-once animate-ease-out animate-normal animate-fill-both`}>
                        {alertMessage}
                    </div>
                )}
                {editing && (
                    <div className="fixed inset-0 w-full h-full bg-black/40 bg-opacity-50 flex items-center justify-center z-50 text-2xl">
                        <div className="bg-white p-5 rounded-md lg:w-[65vw] max-h-screen overflow-y-scroll flex flex-col lg:grid grid-cols-3 gap-2">
                            <h2 className="text-2xl font-medium mb-4 col-span-full text-center">Edit Inventory Item</h2>
                            <label htmlFor="name" className="text-lg font-medium">Name:</label>
                            <input type="text" id="name" className="w-full col-span-2 border border-gray-300 rounded-md p-2 mb-4" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} />
                            <label htmlFor="description" className="text-lg font-medium">Description:</label>
                            <textarea id="description" className="w-full h-full border col-span-2 border-gray-300 rounded-md p-2 mb-4" value={editingItem.description} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} />
                            <label htmlFor="price" className="text-lg font-medium">Price:</label>
                            <input type="number" id="price" className="w-full border col-span-2 border-gray-300 rounded-md p-2 mb-4"  value={editingItem.price} onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                            <label htmlFor="count" className="text-lg font-medium">Stock Count:</label>
                            <input type="number" id="count" className="w-full border col-span-2 border-gray-300 rounded-md p-2 mb-4" value={editingItem.count} onChange={(e) => setEditingItem({...editingItem, count: parseInt(e.target.value) || 0})} />
                            <CldUploadWidget uploadPreset="single-no-camera" options={{multiple: false}}
                            onSuccess={(results: CloudinaryUploadWidgetResults) => {
                                if(results.info && typeof results.info !== "string"){
                                    setNewPhoto(results.info.public_id)
                                }
                            }} >
                                {({ open }) => {
                                    return (
                                      <button 
                                        type="button" 
                                        className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md col-span-full w-fit place-self-center"
                                        onClick={() => open()}
                                      >
                                        Add Image
                                      </button>
                                    );
                                }}
                            </CldUploadWidget>
                            {newPhoto != "" ? 
                            <CldImage src={newPhoto} alt={editingItem.name} width={480} height={480} crop="fill" className=" col-span-full object-cover rounded-md mb-4 place-self-center" /> :
                            <CldImage src={editingItem.photo} alt={editingItem.name} width={480} height={480} crop="fill" className=" col-span-full object-cover rounded-md mb-4 place-self-center" />
                            }
                            <button className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md col-span-1 h-full"
                            onClick={() => {toggleEditing(false); cancelEdit()}}>
                                Cancel
                            </button>
                            <button className="cursor-pointer lg:ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md col-span-2"
                            onClick={() => {
                                toggleEditing(false); 
                                saveEdit();
                                }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
}
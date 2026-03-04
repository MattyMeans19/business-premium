'use client';
import { useEffect, useState, useRef } from "react";
import {AddInventoryItem } from "@/app/(admin)/actions";
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

interface NewProductProps {
    viewModal: boolean;
    toggleAddInventory: (value: boolean) => void;
}

export default function NewProduct({ viewModal, toggleAddInventory }: NewProductProps) {
    const [alertMessage, setAlertMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertColor, setAlertColor] = useState("green");
    const [editingItem, setEditingItem] = useState({name: "", description: "", price: 0, count: 0});
    const [newPhoto, setNewPhoto] = useState("");
    const photoRef = useRef("");

        useEffect(() => {
            if (alertMessage) {
                setAlert(true);
                const timer = setTimeout(() => {
                    setAlert(false);
                    setAlertMessage("");
                }, 3000);
                return () => clearTimeout(timer);
            }
            if (newPhoto && photoRef.current && photoRef.current !== newPhoto) {
                console.log("Cleanup triggered for old photo:", photoRef.current);
                deletePhoto(photoRef.current);
            }
             photoRef.current = newPhoto;
        }, [alertMessage, newPhoto]);


    async function deletePhoto(incomingPhotoId: string) {
            console.log(incomingPhotoId)
            try {
                await fetch("/api/delete-photo", {
                    method: "POST",
                    body: JSON.stringify({ publicId: incomingPhotoId }),
                });
                console.log("Deleted:", incomingPhotoId);
            } catch (err) {
                console.error("Could not delete old photo", err);
            }            

    }

    async function handleAdd() {
        const finalPhoto = newPhoto;

        if(editingItem.name && editingItem.description && editingItem.price && finalPhoto && editingItem.count > 0){
            const response = await AddInventoryItem(editingItem.name, editingItem.description, editingItem.price, finalPhoto, editingItem.count);
            if(response.success){
                setAlertMessage(response.message);
                setAlertColor("green");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else{
                setAlertMessage(response.message);
                setAlertColor("red");
            }
        } else if(!editingItem.name || !editingItem.description || !editingItem.price || editingItem.count <= 0){
            setAlertMessage("All fields including stock count are required to add a new inventory item.");
            setAlertColor("red");
        } else if(!finalPhoto){
            setAlertMessage("A photo is required to add a new inventory item.");
            setAlertColor("red");
        }
    }

        return (
            <div className="w-full h-full relative">
                {alert && (
                    <div className={`fixed z-110 top-15 place-self-center bg-${alertColor}-500 text-white text-4xl px-4 py-2 rounded-md shadow-lg animate-fade-down animate-once animate-ease-out animate-normal animate-fill-both`}>
                        {alertMessage}
                    </div>
                )}
                {viewModal && (
                    <div className="fixed inset-0 w-full h-full bg-black/40 bg-opacity-50 flex items-center justify-center z-100 text-2xl">
                        <div className="bg-white p-5 rounded-md lg:w-[65vw] max-h-screen overflow-y-scroll flex flex-col lg:grid grid-cols-3 gap-2">
                            <h2 className="text-2xl font-medium mb-4 col-span-full text-center">New Inventory Item</h2>
                            <label htmlFor="name" className="text-lg font-medium">Name:</label>
                            <input type="text" id="name" className="w-full col-span-2 border border-gray-300 rounded-md p-2 mb-4" onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} />
                            <label htmlFor="description" className="text-lg font-medium">Description:</label>
                            <textarea id="description" className="w-full h-full border col-span-2 border-gray-300 rounded-md p-2 mb-4" onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} />
                            <label htmlFor="price" className="text-lg font-medium">Price:</label>
                            <input type="number" id="price" className="w-full border col-span-2 border-gray-300 rounded-md p-2 mb-4" onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                            <label htmlFor="count" className="text-lg font-medium">Stock Count:</label>
                            <input type="number" id="count" className="w-full border col-span-2 border-gray-300 rounded-md p-2 mb-4" value={editingItem.count} onChange={(e) => setEditingItem({...editingItem, count: parseInt(e.target.value) || 0})} />
                            <CldUploadWidget uploadPreset="single-no-camera" options={{multiple: false}}
                            onSuccess={(results: CloudinaryUploadWidgetResults) => {
                                    if(results.info && typeof results.info !== "string"){
                                        setNewPhoto(results.info.public_id);
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
                            {newPhoto && (
                                <CldImage src={newPhoto} alt={newPhoto} width={480} height={480} crop="fill" className=" col-span-full object-cover rounded-md mb-4 place-self-center" />
                            )}
                            <button className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md col-span-1 h-full"
                            onClick={() => {
                                toggleAddInventory(false);
                                if (newPhoto) {
                                    deletePhoto(newPhoto);
                                }
                                setEditingItem({name: "", description: "", price: 0, count: 0});
                                setNewPhoto("");
                                photoRef.current = "";
                            }}>
                                Cancel
                            </button>
                            <button className="cursor-pointer lg:ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md col-span-2"
                            onClick={() => {
                                handleAdd();
                                }}>
                                Save Product
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
}
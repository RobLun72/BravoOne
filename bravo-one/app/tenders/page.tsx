"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { TendersSkeleton } from "./tenderSkeleton";
import { toast } from "sonner";
import { stableInit } from "@/Helpers/stableInit";
import { Tender } from "@/DTO/tender";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MaterialsTable } from "./materialsTable";
import { sortAscending } from "@/Helpers/sortAndFilter";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/fileUpload";
//import { BlobServiceClient } from "@azure/storage-blob";

const DownloadIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const GetDataIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
    />
  </svg>
);

export interface ListsPageState {
  load: boolean;
  pendingSave: boolean;
  message: string;
  isDirty: boolean;
  isEditing: boolean;
  showItemForm: boolean;
  showDeleteConfirm: boolean;
  tender?: Tender;
  fileData?: File;
}

export default function Page() {
  const [pageState, setPageState] = useState<ListsPageState>({
    load: false,
    pendingSave: false,
    message: "",
    isDirty: false,
    isEditing: true,
    showItemForm: false,
    showDeleteConfirm: false,
  });

  // const getBlob = async (url: string) => {

  // const account = "<account name>";
  // const sas = "<service Shared Access Signature Token>";
  // const containerName = "<container name>";
  // const blobName = "<blob name>";

  // const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net?${sas}`);
  // const containerClient = blobServiceClient.getContainerClient(containerName);
  // const blobClient = containerClient.getBlobClient(blobName);
  // const downloadBlockBlobResponse = await blobClient.download();
  // const blob = await downloadBlockBlobResponse.blobBody;

  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }
  //   const blob = await response.blob();
  //   const file = new File([blob], "file.pdf", { type: blob.type });
  //   return file;
  // }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const envVariable = process.env.NEXT_PUBLIC_BACK_END_URL;
  //const baseQuery = "/tenders";

  useEffect(() => {
    // const fetchData = async () => {
    //   await stableInit();

    //   try {
    //     const data = await fetch(`${envVariable}`);
    //     const tender: Tender = await data.json();
    //     // Fix the first index if it is empty

    //     setPageState((prev) => ({
    //       ...prev,
    //       load: false,
    //       tender: tender,
    //     }));
    //   } catch (error) {
    //     setPageState((prev) => ({
    //       ...prev,
    //       load: false,
    //     }));
    //     toast.error("Error loading: " + error);
    //   }
    // };

    setPageState((prev) => ({ ...prev, load: true }));
    //fetchData();
  }, [envVariable]);

  const getData = async () => {
    const fetchData = async () => {
      await stableInit();

      try {
        const data = await fetch(`${envVariable}`);
        const tender: Tender = await data.json();
        // Fix the first index if it is empty

        setPageState((prev) => ({
          ...prev,
          load: false,
          tender: tender,
        }));
      } catch (error) {
        setPageState((prev) => ({
          ...prev,
          load: false,
        }));
        toast.error("Error loading: " + error);
      }
    };

    setPageState((prev) => ({ ...prev, load: true }));
    fetchData();
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-blob", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // Success
      setPageState((prev) => ({
        ...prev,
        showItemForm: false,
        pendingSave: false,
      }));
      toast.success("Excel uploaded successfully!");
    } else {
      // Handle error
      setPageState((prev) => ({
        ...prev,
        showItemForm: false,
        pendingSave: false,
      }));
      toast.error("Error uploading: " + res.statusText);
    }
  };

  const handleFileInput = (fileList: FileList) => {
    if (!fileInputRef.current) throw new Error("No file input field found");
    const newFile = fileList?.item(0);
    setPageState((prev) => ({
      ...prev,
      fileData: newFile ?? prev.fileData,
    }));
  };

  return (
    <Fragment>
      <div className="border border-gray-300 bg-white rounded-lg py-2 px-4 mb-4 mx-2 mt-4 flex align-middle justify-between">
        <Button
          variant={"outline"}
          className="p-6 text-lg"
          onClick={() =>
            setPageState((prev) => ({ ...prev, showItemForm: true }))
          }
        >
          {DownloadIcon} Upload Excel
        </Button>
        <Button variant={"outline"} className="p-6 text-lg" onClick={getData}>
          {GetDataIcon} Get restructured Excel data
        </Button>
      </div>
      {pageState.tender === undefined && (
        <div>
          <div className="pt-2 px-3 pb-2 text-xl">Tenders</div>
          <div className="py-2 px-3 mb-4">
            <TendersSkeleton />
          </div>
        </div>
      )}
      {pageState.tender !== undefined && (
        <div>
          <div className="flex flex-row justify-between items-center">
            <div className="pt-2 px-3 pb-2 md:text-xl text-lg">Tenders</div>
          </div>
          <div className="py-2 px-3">
            {pageState.tender &&
              pageState.tender.Aktivitetskort.map((item, index) => {
                return (
                  <div
                    key={"card-" + index}
                    className="border border-gray-300 bg-white rounded-lg p-4 mb-4"
                  >
                    <h2 className="text-lg font-bold">{item.Uppgift}</h2>
                    <p>{item["Uppgift Beskrivning"]}</p>
                    <p>
                      <b>Total tid:</b> {item["Total tid"]}
                    </p>
                    {item.Material.length > 0 && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            Material items ({item.Material.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <MaterialsTable
                              materials={sortAscending(
                                item.Material,
                                "Benämning"
                              )}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {pageState.showItemForm && (
        <div className="fixed bg-black/20 flex z-50 items-center justify-center inset-0">
          <div className="w-10/12 max-w-3xl max-h-[70vh] rounded-sm border-clay border overscroll-contain overflow-auto p-8 bg-white">
            <div className="w-full flex flex-col justify-between">
              <FileInput
                ref={fileInputRef}
                label="Excel file to upload:"
                name="file"
                type="file"
                placeholder={
                  pageState.fileData?.name ?? "Select a file to upload"
                }
                onUpload={(file) => handleFileInput(file)}
                defaultFiles={pageState.fileData && [pageState.fileData]}
              />
              <Button
                variant={"outline"}
                className="mb-4"
                onClick={() => {
                  setPageState((prev) => ({
                    ...prev,
                    pendingSave: true,
                  }));
                  uploadFile(pageState.fileData!);
                }}
                disabled={pageState.fileData === undefined}
              >
                Upload
              </Button>
              <Button
                variant={"outline"}
                className="mb-4"
                onClick={() =>
                  setPageState((prev) => ({ ...prev, showItemForm: false }))
                }
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

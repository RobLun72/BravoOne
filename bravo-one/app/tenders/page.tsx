"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
import { OverlayWithCenteredInput } from "@/components/ui/overlayCenteredInput";
import { LoadingSpinner } from "@/components/ui/spinner";

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
  runTimer: boolean;
  nrOfPolls: number;
}

export default function Page() {
  const [pageState, setPageState] = useState<ListsPageState>({
    load: true,
    pendingSave: false,
    message: "",
    isDirty: false,
    isEditing: true,
    showItemForm: false,
    showDeleteConfirm: false,
    runTimer: false,
    nrOfPolls: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const envVariable = process.env.NEXT_PUBLIC_BACK_END_URL;
  //const baseQuery = "/tenders";

  const getData = useCallback(async () => {
    const fetchData = async () => {
      await stableInit();

      try {
        const data = await fetch(`${envVariable}`);
        const tender: Tender = await data.json();

        let startTimer = false;
        if (
          tender.Aktivitetskort.length === 1 &&
          tender.Aktivitetskort[0].Uppgift === "Generating activity cards..."
        ) {
          startTimer = true;
        }

        setPageState((prev) => ({
          ...prev,
          load: false,
          tender: tender,
          runTimer: startTimer,
          nrOfPolls: startTimer ? prev.nrOfPolls + 1 : 0,
        }));
      } catch (error) {
        setPageState((prev) => ({
          ...prev,
          load: false,
          runTimer: false,
        }));
        toast.error("Error loading: " + error);
      }
    };

    setPageState((prev) => ({ ...prev, load: true }));
    fetchData();
  }, [envVariable]);

  useEffect(() => {
    if (!pageState.runTimer) return;

    const interval = setInterval(() => {
      getData();
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [getData, pageState.runTimer]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    let res: Response;
    if (process.env.NEXT_PUBLIC_ENABLE_MSW_MOCKING === "true") {
      res = new Response(null, { status: 200, statusText: "OK" });
    } else {
      res = await fetch("/api/upload-blob", {
        method: "POST",
        body: formData,
      });
    }

    if (res.ok) {
      // Success
      await new Promise((r) => setTimeout(r, 2000));

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
        <Button
          variant={"outline"}
          className="p-6 text-lg"
          onClick={getData}
          disabled={
            pageState.fileData === undefined ||
            (pageState.fileData !== undefined && pageState.pendingSave === true)
          }
        >
          {GetDataIcon} Generate activity cards
        </Button>
      </div>
      {pageState.tender === undefined && (
        <div>
          <div className="pt-2 px-3 pb-2 text-xl">Activity Cards</div>
          <div className="py-2 px-3 mb-4">
            <TendersSkeleton />
          </div>
        </div>
      )}
      {pageState.tender !== undefined && (
        <div>
          <div className="flex flex-row justify-between items-center">
            <div className="pt-2 px-3 pb-2 md:text-xl text-lg">
              Activity Cards
            </div>
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
                    {item.Uppgift != "Generating activity cards..." && (
                      <p>
                        <b>Total tid:</b> {item["Total tid"]}
                      </p>
                    )}
                    {item.Uppgift === "Generating activity cards..." && (
                      <div className="flex flex-row  w-full align-middle">
                        <LoadingSpinner className="h-8 w-8 text-appBlue animate-spin" />
                        <div className="text-sm ml-2 pt-1.5 mb-4">
                          Checked {pageState.nrOfPolls} time(s)...
                        </div>
                      </div>
                    )}
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
      {pageState.pendingSave && (
        <OverlayWithCenteredInput className="md:h-1/12 h-2/12 p-2 md:w-4/12 w-10/12 flex items-center">
          <div className="flex flex-col items-center justify-center w-full">
            <LoadingSpinner className="h-12 w-12 text-appBlue animate-spin" />
            <div className="text-center text-lg font-semibold mb-4">
              Uploading...
            </div>
          </div>
        </OverlayWithCenteredInput>
      )}
    </Fragment>
  );
}

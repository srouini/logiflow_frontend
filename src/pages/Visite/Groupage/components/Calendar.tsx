import { API_PRINT_SELCTED_DATE_VISITES_GROUPAGE_ENDPOINT, API_VISITESGROUPAGE_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";
import { useAxios } from "@/hooks/useAxios";
import useData from "@/hooks/useData";
import useLoading from "@/hooks/useLoading";
import { CalendarOutlined, CloudDownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Row,
} from "antd";
import { DatePickerProps } from "antd/lib";
import { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { usePermissions } from "@/utils/permissions";


export default () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(open===true) refetch();
  },[open])
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [selectedDate, setSelectedDate] = useState<any>(
    dayjs().format("YYYY-MM-DD")
  );
  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_VISITESGROUPAGE_ENDPOINT,
    name: "GET_TODAY_VISITES",
    params: {
      ordering: "-date_creation,-numero",
      date_visite: selectedDate,
      all: true,
    },
  });

  useEffect(() => {
    refetch();
  }, [selectedDate]);

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  // @ts-ignore
  const onChange: DatePickerProps["onChange"] = (date,stringDate) => {
    if(stringDate)
    setSelectedDate(stringDate);
  };

  const api: AxiosInstance = useAxios();

  const handleDownload = async () => {
    try {

      const response = await api({
        url: API_PRINT_SELCTED_DATE_VISITES_GROUPAGE_ENDPOINT,
        method: "GET",
        responseType: "blob", // Important for handling binary data (PDF)
        params:{date:selectedDate}
      });

      // Extract the filename from the content-disposition header
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `VISITES_${selectedDate}.pdf`; // Default name if header is missing

      // Create a new Blob and trigger the file download
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleViewPDF = async () => {
    try {
      const response = await api({
        url: API_PRINT_SELCTED_DATE_VISITES_GROUPAGE_ENDPOINT,
        method: "GET",
        responseType: "blob", // Important for handling binary data (PDF)
        params:{date:selectedDate}
      });

      // Create a Blob URL for the PDF and open it in a new tab
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank"); // Opens the PDF in a new tab
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };


  const handleSelectedDatePrint = () => {
      if(selectedDate) handleViewPDF() 
  }

  const handleSelectedDateDownload = () => {
    if(selectedDate) handleDownload() 
}

const hasPermission = usePermissions();

  return (
    <>
      <Button onClick={showDrawer} type="primary" icon={<CalendarOutlined />} disabled={!hasPermission("groupage.view_visitegroupage")}>
        Calndrier des visites
      </Button>

      <Drawer
        width={500} 
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <Flex gap={4}>
          <DatePicker
          allowClear={false}
            onChange={onChange}
            size="large"
            style={{ width: "100%" }}
          />
          <Button
            type="dashed"
            icon={<PrinterOutlined />}
            size="large"
            style={{ width: "80px" }}
            onClick={handleSelectedDatePrint}
          ></Button>
                    <Button
            type="dashed"
            icon={<CloudDownloadOutlined />}
            size="large"
            style={{ width: "80px" }}
            onClick={handleSelectedDateDownload}
          ></Button>
        </Flex>
        <Divider />
        <Flex vertical={true} gap={8}>
          {isLoading && "is Loading..."}

          {!isLoading && data?.data?.map((item: any) => {
            return (
              <Card>
                <Flex justify="space-between">
                  <Row align={"middle"}>{item?.visite}</Row>
                  <Row gutter={8} style={{ paddingRight: "10px" }}>
                    <Col><Print endpoint={API_VISITESGROUPAGE_ENDPOINT} endpoint_suffex="generate_pdf/" id={item?.id} type="View" permission="groupage.can_print_visitegroupage"/></Col>
                    <Col><Print endpoint={API_VISITESGROUPAGE_ENDPOINT} endpoint_suffex="generate_pdf/" id={item?.id} type="Download" permission="groupage.can_print_visitegroupage"/></Col>
                  </Row>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      </Drawer>
    </>
  );
};

import { Button, message } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import useData from "@/hooks/useData";
import useLoading from "@/hooks/useLoading";
import { Decimal } from "decimal.js";

interface Props {
  filters?: any;
  search?: string;
  endpoint: string;
  expand?: string;
  button_text?: string;
  query_params?: any;
}

const ExportEtatDFC: React.FC<Props> = ({
  filters,
  search,
  endpoint,
  expand,
  button_text = "Export Etat DFC",
  query_params
}) => {
  const {
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch
  } = useData({
    endpoint,
    name: "GET_DOCUMENTS_FACTURES_GROUPAGE_DFC",
    params: {
      search,
      all: true,
      ...filters,
      
      expand,
      ...query_params
    },
    enabled: false,
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const concatenateQueryset = (queryset: any[]) => {
    const concatenatedQueryset = [];
    const codeComptableDict: { [key: string]: any } = {};

    for (const item of queryset) {
      const codeComptable = item.code_comptable;
      if (codeComptable && codeComptable !== "") {
        if (codeComptable in codeComptableDict) {
          // Concatenate with existing item
          const concatenatedItem = codeComptableDict[codeComptable];
          concatenatedItem.HT = new Decimal(concatenatedItem.HT).plus(item.HT).toNumber();
          concatenatedItem.TVA = new Decimal(concatenatedItem.TVA).plus(item.TVA).toNumber();
          concatenatedItem.TTC = new Decimal(concatenatedItem.TTC).plus(item.TTC).toNumber();
        } else {
          // Add as a new item
          codeComptableDict[codeComptable] = { ...item };
        }
      } else {
        concatenatedQueryset.push(item);
      }
    }

    const _concatenatedQueryset = Object.values(codeComptableDict);
    concatenatedQueryset.push(..._concatenatedQueryset);
    return concatenatedQueryset;
  };

  const handleEnterposage = (queryset: any[]) => {
    // Filter records with rubrique containing "ENTREPOSAGE"
    const filteredRecords = queryset.filter(item => item.rubrique.includes("ENTREPOSAGE"));
    const results = [];

    if (filteredRecords.length > 0) {
      const combinedItem = {
        proforma: filteredRecords[0].proforma,
        rubrique: 'ENTREPOSAGE/GARDIENNAGE',
        rubrique_object: filteredRecords[0].code_comptable,
        rubrique_object__direction__code: filteredRecords[0].code_comptable,
        tarif: new Decimal(0),
        HT: new Decimal(0),
        TVA: new Decimal(0),
        TTC: new Decimal(0),
        code_comptable: filteredRecords[0].code_comptable
      };

      for (const item of filteredRecords) {
        combinedItem.tarif = combinedItem.tarif.plus(item.tarif);
        combinedItem.HT = combinedItem.HT.plus(item.HT);
        combinedItem.TVA = combinedItem.TVA.plus(item.TVA);
        combinedItem.TTC = combinedItem.TTC.plus(item.TTC);
      }

      // Convert Decimal objects back to numbers
      //@ts-ignore
      combinedItem.tarif = combinedItem.tarif.toNumber();
      //@ts-ignore
      combinedItem.HT = combinedItem.HT.toNumber();
      //@ts-ignore
      combinedItem.TVA = combinedItem.TVA.toNumber();
      //@ts-ignore
      combinedItem.TTC = combinedItem.TTC.toNumber();

      // Add non-ENTREPOSAGE items
      for (const item of queryset) {
        if (!item.rubrique.includes("ENTREPOSAGE")) {
          results.push(item);
        }
      }

      if (filteredRecords.length > 0) {
        results.push(combinedItem);
      }

      return results;
    }

    return queryset;
  };

  const handleExport = async () => {
    try {
      const result = await refetch();
      
      if (!result.data?.data?.length) {
        message.warning("No data available for export");
        return;
      }
      const rows: any[] = [];

      for (const item of result.data.data) {
        let lignes = item.proforma?.lignesProformagroupage || item.lignes_facture || item.get_factrue_lines || [];
        lignes = concatenateQueryset(lignes);
        lignes = handleEnterposage(lignes);

        const reference = 
          item.facture_number ? 
            item.facture_number.slice(0, 3) + item.facture_number.slice(5) : 
            '';

        // Create the TTC line
        const _411102 = {
          "": "",
          "PIECE": 0,
          "DATE": item.proforma?.date_proforma || "",
          "REFERENCE": reference,
          "LIBELLE": `${item.proforma?.article?.client?.raison_sociale || ""} P/C ${item.proforma?.sous_article?.client?.raison_sociale || ""} G-${item.proforma?.gros?.numero} A-${item.proforma?.article?.numero} SA-${item.proforma?.sous_article?.numero}`,
          "REBRIQUE": "",
          "CODE_JRN": "",
          "CODE_COM": "411102",
          "CODE_AUX": "",
          "CODE_BDG": "",
          "DEBIT": item.TTC || 0,
          "CREDIT": "",
        };

        // Create the TVA line
        const _445101 = {
          "": "",
          "PIECE": 0,
          "DATE": item.proforma?.date_proforma || "",
          "REFERENCE": reference,
          "LIBELLE": `${item.proforma?.article?.client?.raison_sociale || ""} P/C ${item.proforma?.sous_article?.client?.raison_sociale || ""}  G-${item.proforma?.gros?.numero} A-${item.proforma?.article?.numero} SA-${item.proforma?.sous_article?.numero}`,
          "REBRIQUE": "",
          "CODE_JRN": "",
          "CODE_COM": "445101",
          "CODE_AUX": "",
          "CODE_BDG": "",
          "DEBIT": "",
          "CREDIT": item.TVA || 0,
        };

        // Add the TTC and TVA lines
        rows.push(_411102);
        rows.push(_445101);

        // Add timber line if timber > 0
        if (item.timber > 0) {
          const _447102 = {
            "": "",
            "PIECE": 0,
            "DATE": item.proforma?.date_proforma || "",
            "REFERENCE": reference,
            "LIBELLE": `${item.proforma?.article?.client?.raison_sociale || ""} P/C ${item.proforma?.sous_article?.client?.raison_sociale || ""} G-${item.proforma?.gros?.numero} A-${item.proforma?.article?.numero} SA-${item.proforma?.sous_article?.numero}`,
            "REBRIQUE": "",
            "CODE_JRN": "",
            "CODE_COM": "447102",
            "CODE_AUX": "",
            "CODE_BDG": "",
            "DEBIT": "",
            "CREDIT": item.timber || 0,
          };
          rows.push(_447102);
        }

        // Add rows for each ligne
        for (const ligne of lignes) {
          const row = {
            "": "",
            "PIECE": 0,
            "DATE": item.proforma?.date_proforma || "",
            "REFERENCE": reference,
            "LIBELLE": `${item.proforma?.article?.client?.raison_sociale || ""} P/C ${item.proforma?.sous_article?.client?.raison_sociale || ""}  G-${item.proforma?.gros?.numero} A-${item.proforma?.article?.numero} SA-${item.proforma?.sous_article?.numero}`,
            "REBRIQUE": ligne.rubrique || "",
            "CODE_JRN": "",
            "CODE_COM": ligne.code_comptable || "",
            "CODE_AUX": "",
            "CODE_BDG": ligne.rubrique_object__direction__code || "",
            "DEBIT": "",
            "CREDIT": ligne.HT || 0,
          };
          rows.push(row);
        }

        // Add empty row as separator
        rows.push({});
      }

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // Auto-adjust column widths
      const columnWidths = Object.keys(rows[0] || {}).map(key => ({
        wch: Math.max(
          key.length,
          ...rows.map(row => (row[key]?.toString() || "").length)
        ) + 2
      }));
      worksheet["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Etat DFC");

      // Generate and download file
      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "etat_dfc.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success("Excel export successful!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Failed to export Excel");
    }
  };

  return (
    <Button
      icon={<FileExcelOutlined />}
      onClick={handleExport}
      type="primary"
      loading={isLoading}
    >
      {button_text}
    </Button>
  );
};

export default ExportEtatDFC;

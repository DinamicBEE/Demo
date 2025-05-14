export const exportCSV = (
  table: {
    heders: {
      key: string;
      label: string;
    }[]
    data: any[];
  },
  fileName: string
) => {
  const replacer = (key: string, value: any) => (value === null ? "" : value); 
  const header = table.heders;
  let csv = table.data.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName.key], replacer))
      .join(",")
  );
  csv.unshift(header.map((fieldName) => fieldName.label).join(","));
  const csvArray = csv.join("\r\n");

  var a = document.createElement("a");
  a.href = "data:attachment/csv," + encodeURIComponent("\uFEFF" + csvArray);
  a.target = "_blank";
  a.download = fileName + ".csv";
  document.body.appendChild(a);
  a.click();
};

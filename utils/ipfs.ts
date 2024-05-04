export const uploadIpfs = async (data: any) => {
  const response = await fetch("/api/pinToPinata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();
  console.log(result);
  const url = result.IpfsHash;

  return url;
};

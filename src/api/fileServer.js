import axios from 'axios';

// download file from file server
async function getFileServerData(url, fileName) {
    let filePath = url + fileName + ".json";
    return  axios({
        methods: "get",
        url: filePath
    })
        .then(response => {
            return JSON.parse(response)
        })
        .catch(() => {
            return null;
        })
}

// upload file to file server
async function setFileServerData(url, fileName, obj) {
    const json = JSON.stringify(obj);
    const blob = new Blob([json], { type: "application/json" });
    const formData = new FormData();
    formData.append("document", blob);
    formData.append("fileName", fileName);
    axios({
        methods: "post",
        url: url,
        data: formData,
        header: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    })
    .then((response) => {
        console.log(response.statusText)})
        .catch((error) => {
            throw error;
        });
}

export { getFileServerData, setFileServerData }

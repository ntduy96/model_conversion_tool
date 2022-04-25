<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-4">
        <div class="form-group">
          <select
            v-model="selected"
            class="form-control col-lg-12"
            @change="changeTypeImage()"
          >
            <option value="glb">GLB</option>
            <option value="gltf">GLTF</option>
          </select>
        </div>
      </div>
      <div class="col-sm-8 file-upload">
        <div>
          <input class="upload-button" type="file" @change="onFileChange" />
          <button
            @click="onUploadFile"
            class="upload-button"
            :disabled="!selectedFile"
          >
            <b>Convert</b>
          </button>
        </div>
      </div>
    </div>
    <div class="tableFixHead">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Uploaded date</th>
            <th>Uploaded</th>
            <th>Converted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="images">
          <tr v-for="image in images" :key="image.id">
            <td>{{ new Date(image.created_at).toLocaleString() }}</td>
            <td>
              {{ `${image.name}.${image.upload_uri.split(".").pop()}` }}
              <a class="btn btn-link" @click="downLoadImage(image.upload_uri)"
                >(download)</a
              >
            </td>
            <td>
              {{ `${image.name}.${image.convert_uri.split(".").pop()}` }}
              <a class="btn btn-link" @click="downLoadImage(image.convert_uri)"
                >(download)</a
              >
            </td>
            <td>
              <div class="btn-group" role="group">
                <!-- <button class="btn btn-success" @click="viewImages(image.name)">
                  View
                </button> -->
                <button class="btn btn-danger" @click="deleteImages(image.id)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="nodata" class="no-data">
          <td colspan="5">No data</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const state = reactive({
  images: [],
  selected: "glb",
  nodata: "false",
  selectedFile: "",
});

const { images, selected, nodata, selectedFile } = toRefs(state);

//Load file zip
const onFileChange = (e) => {
  selectedFile.value = "";
  const userSelectedFile = e.target.files[0];
  const fileTypeConverted = userSelectedFile.name.split(".");
  const fileType = fileTypeConverted[fileTypeConverted.length - 1];
  if (fileType != selected.value) {
    if (confirm(`Please upload a ${selected.value} file`)) {
      return;
    }
  }
  if (userSelectedFile.size > 20480000) {
    if (confirm("File cannot exceed 20MB")) {
      return;
    }
  } else {
    selectedFile.value = userSelectedFile;
  }
};

//Updaload file zip
const onUploadFile = async () => {
  const url = selected.value === "gltf" ? "/api/gltf/glb" : "/api/glb/gltf";
  const data = new FormData();
  data.append("file", selectedFile.value);
  try {
    const token = sessionStorage.getItem("token");
    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    confirm("Converted this file successfully");
    await getListImage();
  } catch (err) {
    confirm("Cannot convert this file");
  }
};
// Change list image by type
const changeTypeImage = async () => {
  await getListImage();
};

// Delete image
const deleteImages = async (id) => {
  if (confirm("Do you really want to delete?")) {
    const token = sessionStorage.getItem("token");
    await axios.delete(`/api/file/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await getListImage();
  }
};

// View image
const viewImages = async (url) => {
  router.push({ name: "Image", query: { url: url } });
};
// Download image
const downLoadImage = async (name) => {
  window.location.href = `/api/file/${name}`;
};

// Get list image
const getListImage = async () => {
  nodata.value = false;
  const token = sessionStorage.getItem("token");
  const { data } = await axios.get(`/api/uploaded`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  images.value = data.files || [];
};

// Check user is logged or not
const isLogged = async () => {
  // try {
  //   const response = await axios.post(
  //     `${process.env.VITE_API_URL}/verify/token`,
  //     {
  //       token: getCookie("token"),
  //     }
  //   );
  // } catch (error) {
  //   router.push({ name: "UserPage" });
  // }
};

onMounted(async () => {
  isLogged();
  getListImage();
});
</script>

<style scoped>
.form-control {
  position: right;
  margin-bottom: 10px;
}
.form-group {
  display: flex;
}
.no-data {
  text-align: center;
}
.convert-image {
  position: absolute;
  right: 0px;
  width: 350px;
  border: 1px solid black;
  padding: 10px;
}

h3 {
  background-color: #28a745;
  color: white;
}
.container {
  padding-top: 20px;
}
.action {
  letter-spacing: 5px;
}
.file-upload {
  text-align: right;
}
.upload-button {
  height: 40px;
  color: black;
  border-radius: 6px;
  border-block-color: initial;
}
table {
  text-align: left;
}
.tableFixHead {
  overflow: auto;
  height: 550px;
}
.tableFixHead thead th {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>

<template>
  <el-cascader
    v-model="selectedOptions"
    placeholder="请选择省市区"
    :options="cascaderData"
    @active-item-change="handleItemChange"
    :props="{
      value: 'id',
      label: 'name',
      children: 'cities'
    }"
  ></el-cascader>
</template>

<script>
export default {
  name: 'my-provinces',
  data () {
    return {
      departmentOptions: [],
      cascaderData: [],
      selectedOptions: []
    }
  },
  methods: {
    getNodes (val) {
      let [idArea, sizeArea] = [null, null]
      if (!val) {
        idArea = null
        sizeArea = 0
      } else if (val.length === 1) {
        idArea = val[0]
        sizeArea = val.length // 3:一级 4:二级 6:三级
      } else if (val.length === 2) {
        idArea = val[1]
        sizeArea = val.length // 3:一级 4:二级 6:三级
      }
      this.$post('ibest/service/system/area/areaList', {
        'id': idArea
      }).then(response => {
        if (response.data && response.data.code === '00000000') {
          let Items = response.data.data
          if (sizeArea === 0) { // 初始化 加载一级 省
            this.cascaderData = Items.map((value, i) => {
              return {
                id: value.id,
                name: value.name,
                cities: []
              }
            })
          } else if (sizeArea === 1) { // 点击一级 加载二级 市
            this.cascaderData.map((value, i) => {
              if (value.id === val[0]) {
                if (!value.cities.length) {
                  value.cities = Items.map((value, i) => {
                    return {
                      id: value.id,
                      name: value.name,
                      cities: []
                    }
                  })
                }
              }
            })
          } else if (sizeArea === 2) { // 点击二级 加载三级 区
            this.cascaderData.map((value, i) => {
              if (value.id === val[0]) {
                value.cities.map((value, i) => {
                  if (value.id === val[1]) {
                    if (!value.cities.length) {
                      value.cities = Items.map((value, i) => {
                        return {
                          id: value.id,
                          name: value.name
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        } else {
          console.log(response.data.msg)
        }
      }, error => {
        console.log(error)
      })
    },
    handleItemChange (val) {
      this.getNodes(val)
    }
  },
  mounted () {
    this.getNodes()
  }
}
</script>

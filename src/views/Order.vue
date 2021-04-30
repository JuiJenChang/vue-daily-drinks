<template>
  <div class="home">
    <div class="back-page" @click="$router.push({ name: 'Home' })">Back to orders</div>
    <div class="order-name">
      <h3>{{ orderName }}</h3>
      <span>{{ createDate }}</span>
    </div>
		<el-table
      :data="orderDetail"
      style="width: 100%"
		>
      <el-table-column
        prop="name"
        label="ITEM"
        width="400"
			>
      </el-table-column>
      <el-table-column
        prop=quantity
        label="QUANTITY"
			>
      </el-table-column>
      <el-table-column
        prop="price"
        label="PRICE"
			>
      </el-table-column>
      <el-table-column
        prop="note"
        label="NOTE"
			>
      </el-table-column>
			<el-table-column
        label="MORE"
			>
        <template slot-scope="scope">
					<el-button
						size="mini"
						@click="openDialog('edit', scope.$index, scope.row)">编辑</el-button>
					<el-button
						size="mini"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
      </el-table-column>
    </el-table>

		<div class="plus" @click="openDialog('add')">+</div>	

		<el-dialog :visible.sync="isDialog">
			<el-form :model="form" :rules="rules" ref="ruleForm">
				<el-form-item label="Name" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="Price" prop="price">
					<el-input v-model="form.price"></el-input>
				</el-form-item>
				<el-form-item label="Quantity" prop="quantity">
					<el-input v-model="form.quantity"></el-input>
				</el-form-item>
				<el-form-item label="Note">
					<el-input type="textarea" v-model="form.note"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialog = false">Cancel</el-button>
				<el-button type="primary" @click="submitOrder">Confirm</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>

export default {
	name: 'Order',
	data() {
		return {
      orderDetail: [],
      orderName: '',
      createDate: '',
			form: {
        id: null,
				name: '',
				price: 0,
				quantity: 1,
				note: '',
			},
      orderId: null, 
			isDialog: false,
      rules: {
        name: [
          { required: true, message: '請輸入品名', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '請輸入價格', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '請輸入數量', trigger: 'blur' }
        ],
      }
		}
	},
  computed: {
    orderList() {
      return this.$store.state.orderList
    }
  },
	methods: {
    getList() {
      const id = this.$route.params.id
      const filterDetail = this.orderList.filter(item => item.id === id)
      this.orderDetail = filterDetail[0].list
      this.orderId = filterDetail[0].id
      this.orderName = filterDetail[0].name
      this.createDate = filterDetail[0].date
    },
    openDialog(type, index, row) {
      if (type === 'add') {
        this.form = {
          id: null,
          name: '',
          price: 0,
          quantity: 1,
          note: '',
        }
      } else if (type === 'edit') {
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.price = row.price;
        this.form.quantity = row.quantity;
        this.form.note = row.note;
      }
      this.isDialog = true
    },
		submitOrder() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.form.price = this.form.price * this.form.quantity
          if (this.form.id) {
            const editList = this.orderDetail.map(item => {
              if (item.id === this.form.id) {
                return item = this.form
              } else {
                return item
              }
            })
            this.$store.commit('EDIT_DRINK', { list: editList, id: this.orderId})
          } else {
            const id = this.$route.params.id
            this.form.id = Math.floor(Date.now())
            this.$store.commit('ADD_DRINK', { id: id, item: this.form })
          }
          this.isDialog = false
          this.getList()
          this.form = {
            id: null,
            name: '',
            price: 0,
            quantity: 1,
            note: '',
          }
        } else {
          return false;
        }
      })
		},
		handleDelete(index, row) {
      const id = this.$route.params.id
      this.$store.commit('DELETE_DRINK', { orderId: id, drinkId: row.id })
      this.getList()
		},
	},
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	position: relative;
}
.back-page {
  background: #2a2c33;
  color: #fff;
  height: 40px;
  width: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
}
.order-name {
  background: #2a2c33;
  color: #fff;
  height: 60px;
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 0 20px 20px 0;
}
.plus {
	position: fixed;
  z-index: 100;
	right: 50px;
	bottom: 20px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 1px solid #3b3b3b;
	background: #3b3b3b;
	color: #fff;
	font-size: 20px;
	font-weight: 600;
	display: flex;
	justify-content: center;
	align-items: center;
}
.plus:hover {
	cursor: pointer;
	background: #505050;
	border: 1px solid #505050;
}
</style>
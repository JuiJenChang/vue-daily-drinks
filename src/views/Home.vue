<template>
  <div class="home">
		<el-table
			:data="orderList"
			style="width: 100%"
		>
			<el-table-column
				prop="name"
				label="ORDER"
				width="400"
			>
			</el-table-column>
			<el-table-column
				prop="date"
				label="DATE"
			>
			</el-table-column>
			<el-table-column
				prop="price"
				label="PRICE"
			>
			</el-table-column>
			<el-table-column
				label="MORE"
			>
				<template slot-scope="scope">
					<el-button
						size="mini"
						@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button
						size="mini"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="plus" @click="openDialog = true">+</div>	

		<el-dialog :visible.sync="openDialog">
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
				<el-button @click="openDialog = false">Cancel</el-button>
				<el-button type="primary" @click="submitOrder">Confirm</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
	name: 'Home',
	data() {
		return {
			form: {
        id: null,
				name: '',
				price: 0,
				quantity: 1,
				note: '',
			},
      orderList: [],
			openDialog: false,
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
    orderNumber() {
      return this.$store.state.orderNumber
    }
  },
	methods: {
		createdUuid() {
			let d = Date.now();
			if (typeof performance !==  'undefined' && typeof performance.now === 'function') {
				d += performance.now()
			}
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				let r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			})
		},
		submitOrder() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.form.price = this.form.price * this.form.quantity
          this.form.id = Math.floor(Date.now())
          let id = this.createdUuid()
          this.$store.commit('ADD_ORDER_NUMBER')
          this.$store.commit('CREATE_ORDER', { 
            id: id,
            name: `Order.${this.orderNumber}`,
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            price: this.form.price,
            list: [this.form],
            orderNumber: this.orderNumber
          })
          this.openDialog = false
          this.$router.push({ 
            name: 'Order',
            params: {
              id: id
            }
          })
        } else {
          return false;
        }
      })
		},
    getOrderList() {
      this.orderList = this.$store.state.orderList.map(item => {
        return {
          id: item.id,
          date: item.date,
          name: item.name,
          price: item.list.reduce((prev, curr) => prev + curr.price, 0)
        }
      })
    },
		handleEdit(index, row) {
			this.$router.push({ 
				name: 'Order',
				params: {
					id: row.id
				}
			})
		},
		handleDelete(index, row) {
			this.$store.commit('DELETE_ORDER', row.id)
      this.getOrderList()
		},
	},
  mounted() {
   this.getOrderList() 
  }
}
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	position: relative;
}
.plus {
	position: fixed;
  z-index: 100;
	right: 50px;
	bottom: 20px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background: #3b3b3b;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}
.plus:hover {
	cursor: pointer;
	background: #505050;
	border: 1px solid #505050;
}
</style>
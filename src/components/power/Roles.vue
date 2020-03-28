<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色按钮区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1===0 ? 'bdtop':'', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2===0 ? '':'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showRoleEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" @click="showsetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addRoleForm" ref="editRoleFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <el-form :model="editRoleForm" ref="editRoleFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树型控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox
      node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleDialogVisible: false,
      editRoleForm: {},
    //   控制分配权限对话框的显示与隐藏
      setRightDialogVisible:false,
    //   所有权限列表
      rightsList: [],
    //   树型控件的属性绑定对象
      treeProps: {
          label: 'authName',
          children: 'children',
      },
    //   默认选中的节点id值
      defKeys: [],
    //   当前即将分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.roleList = res.data
      console.log(this.roleList)
    },
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.$message.success('添加角色成功')
      this.addRoleDialogVisible = false
      this.getRoleList()
    },
    addRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },

    // 根据ID删除对应的角色信息
    async removeRoleById(id) {
      // 弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串confirm，取消则为cancle
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败123')
      this.$message.success('删除角色成功')
      this.getRoleList()
    },

    // 提交并修改用户信息
    async editRoleInfo() {
      // 发起修改用户信息的请求
      // console.log(this.$refs.editRoleFormRef,"       ",this.$refs.editRoleFormRef.model.roleId);
      const { data: res } = await this.$http.put(
        'roles/' + this.$refs.editRoleFormRef.model.roleId,
        {
          roleName: this.$refs.editRoleFormRef.model.roleName,
          roleDesc: this.$refs.editRoleFormRef.model.roleDesc
        }
      )
      if (res.meta.status !== 200)
        return this.$message.error('更新角色信息失败')
      // 关闭对话框 刷新 提示
      this.editRoleDialogVisible = false
      this.getRoleList()
      this.$message.success('角色信息修改成功')
    },
    // 展示编辑角色的对话框
    async showRoleEditDialog(id) {
      const { data: res } = await this.$http.get('/roles/' + id)
      if (res.meta.status !== 200)
        return this.$message.error('查询用户信息失败')

      //   console.log(res.data);
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      // this.$message.success('删除成功');
      // this.getRoleList();
      // 利用双向绑定原理更新数据即可，不刷新页面
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showsetRightDialog(role) {
        this.roleId = role.id;
        // 获取所有权限的数据
        const {data:res} = await this.$http.get('rights/tree');
        if(res.meta.status!==200)return this.$message.error('获取权限列表失败');
        this.setRightDialogVisible = true;
        // 获取叶子节点的id
        this.getLeafKeys(role, this.defKeys);
        // 保存获取到的权限数据
        this.rightsList = res.data;
        // console.log(this.rightsList)
    },
    // 通过递归获取角色下三级权限的id并保存到defKeys中
    getLeafKeys(node, arr){
        if(!node.children){
            return arr.push(node.id);
        }

        node.children.forEach(item=>this.getLeafKeys(item, arr));
    },
    // 每次关闭时清空数组
    setRightDialogClosed(){
        this.defKeys = [];
    },
    // 点击分配角色权限
    async allotRights(){
        const keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',');

        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr});
        if(res.meta.status!==200)return this.$message.error('更新权限列表失败');
        this.$message.success('更新权限列表成功!');
        this.getRoleList();
        this.setRightDialogVisible = false;
    },
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
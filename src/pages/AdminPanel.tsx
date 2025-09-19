import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Plus, Edit2, Trash2, Eye, EyeOff, Settings, UserCheck, Menu, X, Mail, FileText, Server, Activity, BarChart3, DollarSign, UserPlus, Send, ShoppingCart, Edit, MapPin, Globe, Percent, Calculator, Zap, HelpCircle, MessageSquare, ChevronDown, ChevronRight, User as UserIcon, Bell, Clock, CreditCard } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser, User } from '../lib/auth';
import { getAllLeads, updateLeadStatus, Lead } from '../lib/leads';
import { getAllRemittanceOrders, updateRemittanceOrderStatus, updateRemittanceOrderPayment, RemittanceOrder } from '../lib/orders';
import { getAllPaymentMethods, PaymentMethod } from '../lib/payment-methods';
import { getRoleMenuByRole, RoleMenu } from '../lib/role-menu';

const AdminPanel: React.FC = () => {
  const { isAuthenticated, logout, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('leads');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [remittanceOrders, setRemittanceOrders] = useState<RemittanceOrder[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<RemittanceOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState(1);
  const [roleMenu, setRoleMenu] = useState<RoleMenu | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    fullname: '',
    password: '',
    rol: 'user'
  });

  const [newRole, setNewRole] = useState({ name: '' });
  const [editingRole, setEditingRole] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [newPermission, setNewPermission] = useState({
    role: '',
    administrar_usuarios: false,
    administrar_leads: false,
    Administrar_precios: false
  });
  const [editingPermission, setEditingPermission] = useState<any>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: 'RMoney'
  });
  const [emailSettingsLoading, setEmailSettingsLoading] = useState(false);

  // Logs state
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const [orderModalTab, setOrderModalTab] = useState(1);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/administracion');
    } else {
      loadUsers();
      loadLeads();
      loadRoles();
      loadRolePermissions();
      loadEmailSettings();
      loadLogs();
      loadRemittanceOrders();
      loadPaymentMethods();
      loadRoleMenu();
    }
  }, [isAuthenticated, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    const fetchedUsers = await getAllUsers();
    setUsers(fetchedUsers);
    setLoading(false);
  };

  const loadLeads = async () => {
    const fetchedLeads = await getAllLeads();
    setLeads(fetchedLeads);
  };

  const loadRemittanceOrders = async () => {
    const orders = await getAllRemittanceOrders();
    setRemittanceOrders(orders);
  };

  const loadPaymentMethods = async () => {
    const methods = await getAllPaymentMethods();
    setPaymentMethods(methods);
  };

  const loadRoleMenu = async () => {
    if (currentUser?.role) {
      const menu = await getRoleMenuByRole(currentUser.role);
      setRoleMenu(menu);
    }
  };

  const loadRoles = async () => {
    const { getAllRoles } = await import('../lib/roles');
    const fetchedRoles = await getAllRoles();
    setRoles(fetchedRoles);
  };

  const loadRolePermissions = async () => {
    const { getAllRolePermissions } = await import('../lib/roles');
    const fetchedPermissions = await getAllRolePermissions();
    setRolePermissions(fetchedPermissions);
  };

  const loadEmailSettings = async () => {
    // Implementation for loading email settings
  };

  const loadLogs = async () => {
    // Implementation for loading logs
  };

  const handleLogout = () => {
    logout();
    navigate('/administracion');
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.fullname || !newUser.password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const createdUser = await createUser(newUser);
    if (createdUser) {
      await loadUsers();
      setNewUser({ username: '', fullname: '', password: '', rol: 'user' });
      setShowAddModal(false);
    } else {
      alert('Error al crear el usuario. Verifica que el nombre de usuario no esté en uso.');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      fullname: user.fullname,
      password: '',
      rol: user.rol
    });
    setShowAddModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    const updateData: any = {
      username: newUser.username,
      fullname: newUser.fullname,
      rol: newUser.rol
    };

    // Only update password if it's provided
    if (newUser.password.trim()) {
      updateData.password = newUser.password;
    }

    const updatedUser = await updateUser(editingUser.id_user, updateData);
    if (updatedUser) {
      await loadUsers();
      setEditingUser(null);
      setNewUser({ username: '', fullname: '', password: '', rol: 'user' });
      setShowAddModal(false);
    } else {
      alert('Error al actualizar el usuario');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const success = await deleteUser(id);
      if (success) {
        await loadUsers();
      } else {
        alert('Error al eliminar el usuario');
      }
    }
  };

  // Role management functions
  const handleAddRole = async () => {
    if (!newRole.name.trim()) {
      alert('Por favor ingresa un nombre para el rol');
      return;
    }

    const { createRole } = await import('../lib/roles');
    const createdRole = await createRole(newRole.name);
    if (createdRole) {
      await loadRoles();
      setNewRole({ name: '' });
      setShowRoleModal(false);
    } else {
      alert('Error al crear el rol');
    }
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setNewRole({ name: role.name });
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !newRole.name.trim()) return;
    
    const { updateRole } = await import('../lib/roles');
    const updatedRole = await updateRole(editingRole.id_role, newRole.name);
    if (updatedRole) {
      await loadRoles();
      setEditingRole(null);
      setNewRole({ name: '' });
      setShowRoleModal(false);
    } else {
      alert('Error al actualizar el rol');
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      const { deleteRole } = await import('../lib/roles');
      const success = await deleteRole(id);
      if (success) {
        await loadRoles();
      } else {
        alert('Error al eliminar el rol');
      }
    }
  };

  // Permission management functions
  const handleAddPermission = async () => {
    if (!newPermission.role) {
      alert('Por favor selecciona un rol');
      return;
    }

    const { createRolePermission } = await import('../lib/roles');
    const createdPermission = await createRolePermission(newPermission);
    if (createdPermission) {
      await loadRolePermissions();
      setNewPermission({
        role: '',
        administrar_usuarios: false,
        administrar_leads: false,
        Administrar_precios: false
      });
      setShowPermissionModal(false);
    } else {
      alert('Error al crear los permisos');
    }
  };

  const handleEditPermission = (permission: any) => {
    setEditingPermission(permission);
    setNewPermission({
      role: permission.role,
      administrar_usuarios: permission.administrar_usuarios,
      administrar_leads: permission.administrar_leads,
      Administrar_precios: permission.Administrar_precios
    });
    setShowPermissionModal(true);
  };

  const handleUpdatePermission = async () => {
    if (!editingPermission) return;
    
    const { updateRolePermission } = await import('../lib/roles');
    const updatedPermission = await updateRolePermission(editingPermission.id_permissions, newPermission);
    if (updatedPermission) {
      await loadRolePermissions();
      setEditingPermission(null);
      setNewPermission({
        role: '',
        administrar_usuarios: false,
        administrar_leads: false,
        Administrar_precios: false
      });
      setShowPermissionModal(false);
    } else {
      alert('Error al actualizar los permisos');
    }
  };

  const handleDeletePermission = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar estos permisos?')) {
      const { deleteRolePermission } = await import('../lib/roles');
      const success = await deleteRolePermission(id);
      if (success) {
        await loadRolePermissions();
      } else {
        alert('Error al eliminar los permisos');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    const success = await updateRemittanceOrderStatus(orderId, newStatus);
    if (success) {
      loadRemittanceOrders();
      if (selectedOrder && selectedOrder.id_pedido === orderId) {
        setSelectedOrder({ ...selectedOrder, estado: newStatus });
      }
    }
  };

  const handleUpdatePaymentInfo = async (orderId: number, metodoPago: string, referenciaPago: string) => {
    const success = await updateRemittanceOrderPayment(orderId, metodoPago, referenciaPago);
    if (success) {
      loadRemittanceOrders();
      if (selectedOrder && selectedOrder.id_pedido === orderId) {
        setSelectedOrder({ 
          ...selectedOrder, 
          metodo_pago: metodoPago,
          referencia_pago: referenciaPago 
        });
      }
    }
  };

  const openOrderModal = (order: RemittanceOrder) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    setOrderModalTab(1);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    setOrderModalTab(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'contactado': return 'bg-blue-100 text-blue-800';
      case 'cobrado': return 'bg-orange-100 text-orange-800';
      case 'entregado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOfferName = (oferta: number) => {
    const offerNames: { [key: number]: string } = {
      1: 'Oferta 1',
      2: 'Oferta 2', 
      3: 'Oferta 3',
      4: 'Envío Personalizado'
    };
    return offerNames[oferta] || 'Desconocida';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'lead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeSection === 'leads') return user.role === 'lead';
    return true;
  });

  const sidebarItems = [
    {
      id: 'estadisticas', 
      label: 'Estadísticas',
      icon: BarChart3,
      submenu: [
        { id: 'ingresos-utilidades', label: 'Ingresos Utilidades', icon: DollarSign },
        { id: 'lead-clientes', label: 'Lead y Clientes', icon: Users }
      ]
    },
    {
      id: 'captacion', 
      label: 'Captación',
      icon: UserPlus,
      submenu: [
        { id: 'leads-consultas', label: 'Leads y Consultas', icon: UserCheck },
        { id: 'pedidos-remesas', label: 'Pedidos de Remesas', icon: Send },
        { id: 'registro-manual', label: 'Registro Manual', icon: Edit }
      ]
    },
    {
      id: 'clientes', 
      label: 'Clientes',
      icon: Users,
      submenu: [
        { id: 'registrados', label: 'Registrados', icon: UserCheck },
        { id: 'no-registrados', label: 'Usuarios no Registrados', icon: Users }
      ]
    },
    {
      id: 'servicios', 
      label: 'Servicios',
      icon: Settings,
      submenu: [
        { id: 'ofertas', label: 'Ofertas', icon: ShoppingCart },
        { 
          id: 'control-municipios', 
          label: 'Control Municipios', 
          icon: MapPin,
          submenu: [
            { id: 'servicios-habilitados', label: 'Servicios Habilitados' }
          ]
        }
      ]
    },
    {
      id: 'gestion', 
      label: 'Gestión',
      icon: Zap,
      submenu: [
        { id: 'envio-ofertas', label: 'Envío de ofertas', icon: Send }
      ]
    },
    {
      id: 'finanzas',
      label: 'Finanzas',
      icon: DollarSign,
      submenu: [
        { id: 'disponibilidad', label: 'Disponibilidad', icon: Globe },
        { 
          id: 'precios', 
          label: 'Precios', 
          icon: Percent,
          submenu: [
            { id: 'tasas-cambio', label: 'Tasas de Cambio' },
            { id: 'registro-tasas', label: 'Registro de tasas' }
          ]
        }
      ]
    },
    {
      id: 'distribucion',
      label: 'Distribución',
      icon: Send,
      submenu: [
        { id: 'mensajeros', label: 'Mensajeros', icon: Users }
      ]
    },
    {
      id: 'comunicacion',
      label: 'Comunicación',
      icon: MessageSquare,
      submenu: [
        { id: 'testimonios-comunicacion', label: 'Testimonios', icon: MessageSquare },
        { id: 'quejas-sugerencias', label: 'Quejas y Sugerencias', icon: MessageSquare }
      ]
    },
    {
      id: 'web-control',
      label: 'Web Control',
      icon: Globe,
      submenu: [
        { id: 'estado', label: 'Estado', icon: Activity },
        { id: 'horario', label: 'Horario', icon: Clock }
      ]
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: UserIcon,
      submenu: [
        { id: 'ajustes', label: 'Ajustes', icon: Settings },
        { id: 'notificaciones', label: 'Notificaciones', icon: Bell }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      submenu: [
        { 
          id: 'usuarios', 
          label: 'Usuarios', 
          icon: Users,
          submenu: [
            { id: 'administrar', label: 'Administrar' },
            { id: 'roles', label: 'Roles' },
            { id: 'permisos', label: 'Permisos' },
            { id: 'estados', label: 'Estados' }
          ]
        },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'apis', label: 'APIs', icon: Server },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'testimonios-config', label: 'Testimonios', icon: MessageSquare },
        { 
          id: 'logs', 
          label: 'Logs', 
          icon: FileText,
          submenu: [
            { id: 'logs-usuarios', label: 'Usuarios' },
            { id: 'logs-sistema', label: 'Sistema' }
          ]
        }
      ]
    }
  ];

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = activeSection === item.id;
    const paddingLeft = level === 0 ? 'pl-6' : level === 1 ? 'pl-10' : 'pl-14';
    
    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleMenu(item.id);
            } else {
              setActiveSection(item.id);
            }
          }}
          className={`w-full flex items-center justify-between ${paddingLeft} py-3 text-left hover:bg-gray-50 transition-colors ${
            isActive ? 'bg-green-50 text-[#00B871] border-r-2 border-[#00B871]' : 'text-gray-700'
          }`}
        >
          <div className="flex items-center">
            {item.icon && level < 2 && <item.icon className="w-5 h-5 mr-3" />}
            <span className={level === 0 ? 'font-medium' : level === 1 ? 'text-sm' : 'text-xs'}>{item.label}</span>
          </div>
          {hasSubmenu && (
            isExpanded ? 
              <ChevronDown className="w-4 h-4 mr-4" /> : 
              <ChevronRight className="w-4 h-4 mr-4" />
          )}
        </button>
        
        {hasSubmenu && isExpanded && (
          <div>
            {item.submenu.map((subItem: any) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B871] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles del Pedido #{selectedOrder.id_pedido}
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 1, name: 'Remitente', icon: UserIcon },
                  { id: 2, name: 'Receptor', icon: MapPin },
                  { id: 3, name: 'Método de Cobro', icon: CreditCard },
                  { id: 4, name: 'Información de Pago', icon: DollarSign },
                  { id: 5, name: 'Entrega', icon: Send }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOrderTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeOrderTab === tab.id
                        ? 'border-[#00B871] text-[#00B871]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Tab 1: Remitente */}
              {activeOrderTab === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Remitente</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.fullname_remitente}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.correo_remitente}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.numero_remitente}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">País</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.pais_remitente || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Receptor */}
              {activeOrderTab === 2 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Receptor</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.fullname_receptor}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Carnet de Identidad</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.carnet_receptor}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contacto</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.contacto_receptor}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Provincia</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.provincia}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Municipio</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.municipio}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Dirección</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.direccion}</p>
                    </div>
                    {selectedOrder.detalles && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Detalles</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.detalles}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Método de Cobro */}
              {activeOrderTab === 3 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Método de Cobro</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Método</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedOrder.metodo_cobro}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Moneda</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.moneda}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Oferta</label>
                      <p className="mt-1 text-sm text-gray-900">Oferta {selectedOrder.oferta}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Importe a Cobrar</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.importe_cobrar || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Información de Pago */}
              {activeOrderTab === 4 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Pago</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                      <select
                        value={selectedOrder.metodo_pago || ''}
                        onChange={(e) => {
                          const newOrder = { ...selectedOrder, metodo_pago: e.target.value };
                          setSelectedOrder(newOrder);
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00B871] focus:border-[#00B871]"
                      >
                        <option value="">Seleccionar método</option>
                        {paymentMethods.map((method) => (
                          <option key={method.id_metodo} value={method.nombre}>
                            {method.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Referencia de Pago</label>
                      <input
                        type="text"
                        value={selectedOrder.referencia_pago || ''}
                        onChange={(e) => {
                          const newOrder = { ...selectedOrder, referencia_pago: e.target.value };
                          setSelectedOrder(newOrder);
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00B871] focus:border-[#00B871]"
                        placeholder="Ingrese referencia"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        if (selectedOrder.metodo_pago && selectedOrder.referencia_pago) {
                          handleUpdatePaymentInfo(
                            selectedOrder.id_pedido,
                            selectedOrder.metodo_pago,
                            selectedOrder.referencia_pago
                          );
                        }
                      }}
                      className="bg-[#00B871] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Guardar Información de Pago
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 5: Entrega */}
              {activeOrderTab === 5 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Entrega</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mensajero Asignado</label>
                      <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00B871] focus:border-[#00B871]">
                        <option value="">Seleccionar mensajero</option>
                        <option value="mensajero1">Juan Pérez</option>
                        <option value="mensajero2">María García</option>
                        <option value="mensajero3">Carlos Rodríguez</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Entrega Estimada</label>
                      <input
                        type="date"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00B871] focus:border-[#00B871]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Notas de Entrega</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00B871] focus:border-[#00B871]"
                        placeholder="Notas adicionales sobre la entrega..."
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="bg-[#00B871] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Guardar Información de Entrega
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <img
            src="/logo png.png"
            alt="RMoney Logo"
            className="h-10 w-auto"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-8">
          {sidebarItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveSection('ajustes')}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#00B871] transition-colors rounded-lg hover:bg-gray-100"
                title="Perfil"
              >
                <UserIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveSection('notificaciones')}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#00B871] transition-colors rounded-lg hover:bg-gray-100"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#00B871] transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Estadísticas */}
          {activeSection === 'ingresos-utilidades' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <DollarSign className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Ingresos y Utilidades</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Módulo de ingresos y utilidades en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'lead-clientes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Estadísticas de Leads y Clientes</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Estadísticas de leads y clientes en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Captación */}
          {activeSection === 'leads-consultas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <UserCheck className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Leads y Consultas</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Lista de Leads</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.nombre_completo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.telefono}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-[#00B871] hover:text-green-700 mr-3">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pedidos de Remesas */}
          {activeSection === 'pedidos-remesas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Pedidos de Remesas</h2>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Destino
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Método/Moneda
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Importe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Oferta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {remittanceOrders.map((order) => (
                        <tr key={order.id_pedido} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.fullname_remitente}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.correo_remitente}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.provincia}, {order.municipio}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.fullname_receptor}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.metodo_cobro}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.moneda}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${order.importe}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.importe_cobrar && `→ ${order.importe_cobrar}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              Oferta {order.oferta}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.estado}
                              onChange={(e) => handleUpdateOrderStatus(order.id_pedido, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${
                                order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                order.estado === 'contactado' ? 'bg-blue-100 text-blue-800' :
                                order.estado === 'cobrado' ? 'bg-green-100 text-green-800' :
                                order.estado === 'entregado' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="contactado">Contactado</option>
                              <option value="cobrado">Cobrado</option>
                              <option value="entregado">Entregado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                                setActiveOrderTab(1);
                              }}
                              className="text-[#00B871] hover:text-green-700 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'registro-manual' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Edit className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Registro Manual</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Módulo de registro manual en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Clientes */}
          {activeSection === 'registrados' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <UserCheck className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Clientes Registrados</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Lista de clientes registrados en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'no-registrados' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Usuarios no Registrados</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Lista de usuarios no registrados en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Servicios */}
          {activeSection === 'ofertas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <ShoppingCart className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Gestión de Ofertas</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Módulo de gestión de ofertas en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'servicios-habilitados' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Settings className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Servicios Habilitados</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Configuración de servicios habilitados en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'disponibilidad' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Disponibilidad</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Control de disponibilidad en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'tasas-cambio' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Percent className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Tasas de Cambio</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de tasas de cambio en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'registro-tasas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Calculator className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Registro de Tasas</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Registro histórico de tasas en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Gestión */}
          {activeSection === 'envio-ofertas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Send className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Envío de Ofertas</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Sistema de envío de ofertas en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Finanzas */}
          {activeSection === 'disponibilidad' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Disponibilidad</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Control de disponibilidad en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'tasas-cambio' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Percent className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Tasas de Cambio</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de tasas de cambio en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'registro-tasas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Calculator className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Registro de Tasas</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Registro histórico de tasas en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Distribución */}
          {activeSection === 'mensajeros' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Mensajeros</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de mensajeros en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Comunicación */}
          {activeSection === 'testimonios-comunicacion' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Testimonios</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de testimonios en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'quejas-sugerencias' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Quejas y Sugerencias</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de quejas y sugerencias en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Web Control */}
          {activeSection === 'estado' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Activity className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Estado del Sistema</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Monitor de estado del sistema en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'horario' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Horarios</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de horarios en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Perfil */}
          {activeSection === 'ajustes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Settings className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Ajustes de Perfil</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Configuración de perfil en desarrollo...</p>
              </div>
            </div>
          )}

          {activeSection === 'notificaciones' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Bell className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Notificaciones</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Centro de notificaciones en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Configuración - Usuarios */}
          {activeSection === 'administrar' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Administrar Usuarios</h2>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#00B871] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Usuario
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id_user}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullname}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.rol)}`}>
                              {user.rol}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-[#00B871] hover:text-green-700 mr-3"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id_user)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'roles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Settings className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Gestión de Roles</h2>
                </div>
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="bg-[#00B871] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Rol
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {roles.map((role) => (
                        <tr key={role.id_role}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(role.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditRole(role)}
                              className="text-[#00B871] hover:text-green-700 mr-3"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id_role)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'permisos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Settings className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Gestión de Permisos</h2>
                </div>
                <button
                  onClick={() => setShowPermissionModal(true)}
                  className="bg-[#00B871] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Permisos
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrar Usuarios</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrar Leads</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrar Precios</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rolePermissions.map((permission) => (
                        <tr key={permission.id_permissions}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{permission.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              permission.administrar_usuarios ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {permission.administrar_usuarios ? 'Sí' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              permission.administrar_leads ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {permission.administrar_leads ? 'Sí' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              permission.Administrar_precios ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {permission.Administrar_precios ? 'Sí' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditPermission(permission)}
                              className="text-[#00B871] hover:text-green-700 mr-3"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePermission(permission.id_permissions)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'estados' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Activity className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Estados de Usuario</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de estados de usuario en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Configuración - Email */}
          {activeSection === 'email' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Configuración de Email</h2>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Servidor SMTP
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                        value={emailSettings.smtp_host}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Puerto SMTP
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                        value={emailSettings.smtp_port}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_port: e.target.value})}
                        placeholder="587"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usuario SMTP
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                        value={emailSettings.smtp_user}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_user: e.target.value})}
                        placeholder="tu-email@gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña SMTP
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                        value={emailSettings.smtp_password}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_password: e.target.value})}
                        placeholder="contraseña-de-aplicación"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Remitente
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                        value={emailSettings.from_email}
                        onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
                        placeholder="noreply@rmoney.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Remitente
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                        value={emailSettings.from_name}
                        onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
                        placeholder="RMoney"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Instrucciones para Gmail:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Habilita la verificación en 2 pasos en tu cuenta de Gmail</li>
                      <li>• Genera una contraseña de aplicación específica</li>
                      <li>• Usa esa contraseña de aplicación en el campo "Contraseña SMTP"</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={emailSettingsLoading}
                      className="bg-[#00B871] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {emailSettingsLoading ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Configuración - APIs */}
          {activeSection === 'apis' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Server className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Configuración de APIs</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Configuración de APIs en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Configuración - FAQ */}
          {activeSection === 'faq' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <HelpCircle className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Gestión de FAQ</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Gestión de preguntas frecuentes en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Configuración - Testimonios */}
          {activeSection === 'testimonios-config' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Configuración de Testimonios</h2>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Configuración de testimonios en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Configuración - Logs */}
          {activeSection === 'logs-usuarios' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-[#00B871] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Logs de Usuarios</h2>
                </div>
                <button
                  onClick={loadLogs}
                  disabled={logsLoading}
                  className="bg-[#00B871] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {logsLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            No hay logs disponibles
                          </td>
                        </tr>
                      ) : (
                        logs.map((log, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.usuario}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                log.accion === 'login' ? 'bg-green-100 text-green-800' :
                                log.accion === 'logout' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {log.accion}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.detalles}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(log.fecha).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
};

export default AdminPanel;
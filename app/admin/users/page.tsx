"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import debounce from 'debounce';
import { z } from "zod"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

import AdminSkeleton from "@/components/admin-skeleton"
import { useUsers } from "@/hooks/admin/useUsers"
import { Role, User } from "@/app/types/user"
import { userSchema } from "@/lib/schemas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersTablePage() {
    const { fetchUsers, createUser, updateUser, deleteUser, loading, error } = useUsers()
    type UserForm = z.infer<typeof userSchema>

    const [users, setUsers] = useState<User[]>([])
    const [open, setOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
    const [form, setForm] = useState<UserForm>({
        first_name: "",
        last_name: "",
        email: "",
        role: "user",
        phone_number: "",
        street_address: "",
        barangay: "",
        password: "",
    })

    const { toast } = useToast()

    const handleSearch = debounce((value: string) => {
        setPage(1);
        setSearch(value);
    }, 400);

    // Load users
    useEffect(() => {
        fetchUsers({ page, search })
            .then(res => {
                setUsers(res.data);
                setTotalPages(res.meta?.last_page);
            })
            .catch(console.error);
    }, [page, search]);

    // Open create form
    const openCreate = () => {
        setEditingUser(null)
        setForm({
            first_name: "",
            last_name: "",
            email: "",
            role: "user",
            phone_number: "",
            street_address: "",
            barangay: "",
            password: "",
        })
        setFieldErrors({})
        setOpen(true)
    }

    // Open edit form
    const openEdit = (user: User) => {
        setEditingUser(user)
        setForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role ?? "user",
            phone_number: user.phone_number ?? "",
            street_address: user.street_address ?? "",
            barangay: user.barangay ?? "",
            password: "", // optional on edit
        })
        setFieldErrors({})
        setOpen(true)
    }



    // Handle create / update
    const handleSubmit = async () => {
        try {
            const parsed = userSchema.parse(form);
            if (editingUser) {
                const updatedUser = await updateUser(editingUser.id, parsed);
                setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
                toast({ title: "User updated" });
            } else {
                const newUser = await createUser(parsed);
                setUsers(prev => [newUser, ...prev]);
                toast({ title: "User created" });
            }
            setOpen(false);
            setFieldErrors({});
        } catch (err: any) {
            const apiErrors = err?.response?.data?.errors;
            if (apiErrors) return setFieldErrors(apiErrors);
            toast({ title: "Action failed", description: err?.message ?? "Unknown error", variant: "destructive" });
        }
    };

    // Delete user
    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id)
            setUsers(prev => prev.filter(u => u.id !== id))
            toast({ title: "User deleted" })
        } catch {
            toast({
                title: "Delete failed",
                variant: "destructive",
            })
        }
    }

    // Render
    // if (loading) return <AdminSkeleton />

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Users</h2>
                    <p className="text-muted-foreground">Manage application users</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search users..."
                        onChange={e => handleSearch(e.target.value)}
                        className="w-60"
                    />
                    <Button onClick={() => openCreate()}>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </div>
            </div>

            {loading ? <AdminSkeleton /> :
            
            <Card>
                <CardHeader>
                    <CardTitle>Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Role</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-muted/30">
                                    <td className="p-3 font-medium">{user.first_name} {user.last_name}</td>
                                    <td className="p-3 text-muted-foreground">{user.email}</td>
                                    <td className="p-3">{user.role?.toUpperCase() ?? "N/A"}</td>
                                    <td className="p-3 flex gap-2">
                                        {/* Edit button */}
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => openEdit(user)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>

                                        {/* Delete confirmation dialog */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(user.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
                            Previous
                        </Button>
                        <span>Page {page} of {totalPages}</span>
                        <Button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
            }

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>First Name</Label>
                                <Input
                                    placeholder="First name"
                                    value={form.first_name}
                                    onChange={e => setForm({ ...form, first_name: e.target.value })}
                                />
                                {fieldErrors.first_name?.map((msg, idx) => (
                                    <p key={idx} className="text-red-500 text-xs">{msg}</p>
                                ))}
                            </div>

                            <div>
                                <Label>Last Name</Label>
                                <Input
                                    placeholder="Last name"
                                    value={form.last_name}
                                    onChange={e => setForm({ ...form, last_name: e.target.value })}
                                />
                                {fieldErrors.last_name?.map((msg, idx) => (
                                    <p key={idx} className="text-red-500 text-xs">{msg}</p>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                placeholder="Email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                            {fieldErrors.email?.map((msg, idx) => (
                                <p key={idx} className="text-red-500 text-xs">{msg}</p>
                            ))}
                        </div>

                        <div>
                            <Label>Role</Label>
                            <Select
                                value={form.role}
                                onValueChange={(value) => setForm({ ...form, role: value as Role })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["admin", "user", "rider"].map((role) => (
                                        <SelectItem key={role} value={role}>{role.toUpperCase()}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldErrors.role?.map((msg, idx) => (
                                <p key={idx} className="text-red-500 text-xs">{msg}</p>
                            ))}
                        </div>

                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                placeholder="Phone number"
                                value={form.phone_number}
                                onChange={e => setForm({ ...form, phone_number: e.target.value })}
                            />
                            {fieldErrors.phone_number?.map((msg, idx) => (
                                <p key={idx} className="text-red-500 text-xs">{msg}</p>
                            ))}
                        </div>

                        <div>
                            <Label>Street Address</Label>
                            <Input
                                placeholder="Street address"
                                value={form.street_address}
                                onChange={e => setForm({ ...form, street_address: e.target.value })}
                            />
                            {fieldErrors.street_address?.map((msg, idx) => (
                                <p key={idx} className="text-red-500 text-xs">{msg}</p>
                            ))}
                        </div>

                        <div>
                            <Label>Barangay</Label>
                            <Input
                                placeholder="Barangay"
                                value={form.barangay}
                                onChange={e => setForm({ ...form, barangay: e.target.value })}
                            />
                            {fieldErrors.barangay?.map((msg, idx) => (
                                <p key={idx} className="text-red-500 text-xs">{msg}</p>
                            ))}
                        </div>

                        <div>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                placeholder={editingUser ? "New password (optional)" : "Password"}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                            {fieldErrors.password?.map((msg, idx) => (
                                <p key={idx} className="text-red-500 text-xs">{msg}</p>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSubmit}>{editingUser ? "Update" : "Create"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
}

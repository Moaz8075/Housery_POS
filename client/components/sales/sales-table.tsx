'use client'

import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Customer, getCustomers, Sale } from '@/lib/dataProvider'

interface SalesTableProps {
	sales: Sale[]
}

export function SalesTable({ sales }: SalesTableProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [customers, setCustomers] = useState<Customer[]>([])

	useEffect(() => {
		async function loadCustomers() {
			try {
				const data = await getCustomers()
				setCustomers(data)
			} catch (error) {
				console.error('Failed to fetch customers', error)
			}
		}
		loadCustomers()
	}, [])

	const filteredSales = sales.filter((sale) => {
		const query = searchQuery.toLowerCase()
		const customer = customers.find((c) => c._id === (typeof sale.customer === "string" ? sale.customer : sale.customer?._id))
		const customerName = customer?.name.toLowerCase() || 'walk-in'
		const saleDate = sale.createdAt
			? new Date(sale.createdAt).toLocaleDateString()
			: ""

		return (
			customerName.includes(query) ||
			sale._id.toLowerCase().includes(query) ||
			saleDate.includes(query) ||
			sale.total.toString().includes(query)
		)
	})

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Search className="h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search by customer name, sale ID, date, or amount..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="flex-1"
				/>
			</div>

			{filteredSales.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-muted-foreground">No sales found matching your search.</p>
				</div>
			) : (
				<div className="grid gap-4">
					{filteredSales.map((sale) => {
						return (
							<div key={sale._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">Customer</p>
										<p className="font-medium">
											{typeof sale.customer === 'object' && sale.customer?.name
												? sale.customer.name
												: 'Walk-in Customer'}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Date</p>
										<p className="font-medium">
											{sale.createdAt
												? new Date(sale.createdAt).toLocaleDateString()
												: "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Amount</p>
										<p className="font-semibold text-lg">Rs. {sale.total.toLocaleString()}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Items</p>
										<p className="font-medium">{sale.items.length} item{sale.items.length !== 1 ? 's' : ''}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Status</p>
										<p className="font-medium">
											<span
												className={`px-2 py-1 rounded-full text-xs font-semibold ${sale.total - sale.paidAmount === 0
													? 'bg-green-100 text-green-800'
													: 'bg-yellow-100 text-yellow-800'
													}`}
											>
												{sale.paidAmount === 0 ? 'Paid' : `Pending: Rs. ${(sale.total - sale.paidAmount).toLocaleString()}`}
											</span>
										</p>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t">
									<p className="text-xs text-muted-foreground mb-2">Items:</p>
									<div className="space-y-1">
										{sale.items.map((item, idx) => {
											// Only use item if it's populated
											if (typeof item.item === 'object' && item.item !== null) {
												const stockItem = item.item;
												const categoryName = stockItem.categoryId?.name || 'N/A';
												const brandName = stockItem.brandId?.name || 'N/A';
												const typeName = stockItem.typeId?.name || 'N/A';
												const sizeName = stockItem.sizeId?.name || 'N/A';

												return (
													<div key={idx} className="flex flex-wrap items-center gap-1 text-sm">
														<span className="font-semibold text-primary">{categoryName}</span>
														<span className="text-muted-foreground">→</span>
														<span className="font-semibold text-blue-600">{brandName}</span>
														<span className="text-muted-foreground">→</span>
														<span className="font-semibold text-green-600">{typeName}</span>
														<span className="text-muted-foreground">→</span>
														<span className="font-semibold text-purple-600">{sizeName}</span>
														<span className="ml-2">:</span>
														<span className="ml-1 font-medium">{item.quantity} dozen × {item.unitPrice}</span>
														<span className="ml-1 font-bold text-green-700">= Rs. {item.subtotal}</span>
													</div>
												)
											} else {
												return (
													<p key={idx} className="text-sm">
														Unknown Item : {item.quantity} dozen × {item.unitPrice} = Rs. {item.subtotal}
													</p>
												);
											}
										})}
									</div>
								</div>

							</div>
						)
					})}
				</div>
			)}

			<div className="text-sm text-muted-foreground text-center py-4">
				Showing {filteredSales.length} of {sales.length} sales
			</div>
		</div>
	)
}

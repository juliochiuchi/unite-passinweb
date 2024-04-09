import { Search, MoreHorizontal, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useState } from 'react'
import { attendees } from '../data/attendees'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export const AttendeeList = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(attendees.length / 10)
  const [attendees, setAttendees] = useState([])

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const goToNextPage = () => {
    setPage(page + 1)
  }

  const goToPrevPage = () => {
    setPage(page - 1)
  }

  const goToLastPage = () => {
    setPage(totalPages)
  }

  const goToFirstPage = () => {
    setPage(1)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Participantes</h1>

        <div className="gap-3 w-64 px-3 py-1.5 border border-white/10 rounded-lg text-sm flex items-center">
          <Search className='size-4 text-emerald-300' />
          <input onChange={handleSearch} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm" placeholder="buscar participante..." />
        </div>
      </div>

      <Table>
        <thead>
          <tr className='border-b border-white/10'>
            <TableHeader style={{ width: 48 }}>
              <input type='checkbox' className='size-4 bg-black/20 rounded border border-white/10 accent-orange-400 checked:bg-orange-400 checked:text-orange-400 checked:border-none' />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inserção</TableHeader>
            <TableHeader> Data de check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>

        <tbody>
          {
            attendees.slice((page - 1) * 10, page * 10).map((attendee) => {
              return (
                <TableRow key={attendee.id} className='border-b border-white/10 hover:bg-white/5'>
                  <TableCell>
                    <input type='checkbox' className='size-4 bg-black/20 rounded border border-white/10 accent-orange-400' />
                  </TableCell>
                  <TableCell>{attendee.id}</TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-semibold text-white'>{attendee.name}</span>
                      <span>{attendee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                  <TableCell>{dayjs().to(attendee.checkedInAt)}</TableCell>
                  <TableCell>
                    <IconButton transparent><MoreHorizontal className='size-4' /></IconButton>
                  </TableCell>
                </TableRow>
              )
            })
          }
        </tbody>

        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando 10 de {attendees.length} itens
            </TableCell>
            <TableCell colSpan={3} className='text-right'>
              <div className='inline-flex items-center gap-8'>
                <span>Página {page} de {totalPages}</span>

                <div className='flex gap-1.5'>
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className='size-4' />
                  </IconButton>

                  <IconButton onClick={goToPrevPage} disabled={page === 1}>
                    <ChevronLeft className='size-4' />
                  </IconButton>

                  <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                    <ChevronRight className='size-4' />
                  </IconButton>

                  <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                    <ChevronsRight className='size-4' />
                  </IconButton>
                </div>
              </div>
            </TableCell>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
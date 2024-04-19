import { Search, MoreHorizontal, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface IAttendee {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  checkedInAt: string | null,
}

export const AttendeeList = () => {
  const [attendees, setAttendees] = useState<IAttendee[]>([])
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? '' // se tiver nulo, retornar vazio tambem dessa forma
    }

    return ''
  })
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [total, setTotal] = useState(0)
  const totalPages = Math.ceil(total / 10)

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')

    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0)
      url.searchParams.set('query', search)

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.attendees)
        setTotal(data.total)
      })
  }, [page, search])

  const setCurrentSearch = (search: string) => {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    window.history.pushState({}, '', url)
    setSearch(search)
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  const setCurrentPage = (page: number) => {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url)
    setPage(page)
  }

  const goToNextPage = () => {
    setCurrentPage(page + 1)
  }

  const goToPrevPage = () => {
    setCurrentPage(page - 1)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)

  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Participantes</h1>

        <div className="gap-3 w-64 px-3 py-1.5 border border-white/10 rounded-lg text-sm flex items-center">
          <Search className='size-4 text-emerald-300' />
          <input onChange={handleSearch} value={search} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" placeholder="buscar participante..." />
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
            attendees.map((attendee) => {
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
                  <TableCell>
                    {attendee.checkedInAt === null
                      ? <span className='text-zinc-400'>Não fez check-in</span>
                      : dayjs().to(attendee.checkedInAt)}
                  </TableCell>
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
              Mostrando {attendees.length} de {total} itens
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

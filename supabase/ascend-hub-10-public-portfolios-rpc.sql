create or replace function public.discover_ascend_hub_portfolios(p_user_id uuid)
returns table(id uuid,title text,summary text,role_title text,start_date date,end_date date,cover_url text,project_url text,featured boolean)
language sql stable security definer set search_path='' as $$
 select i.id,i.title,i.summary,i.role_title,i.start_date,i.end_date,i.cover_url,i.project_url,i.featured
 from public.ascend_hub_portfolio_initiatives i
 join public.ascend_hub_public_profiles p on p.user_id=i.user_id
 join public.ascend_hub_members m on m.user_id=p.user_id
 where i.user_id=p_user_id and i.publicly_visible and p.publicly_visible and m.status='approved'
 order by i.featured desc,i.sort_order asc limit 30;
$$;
revoke all on function public.discover_ascend_hub_portfolios(uuid) from public;
grant execute on function public.discover_ascend_hub_portfolios(uuid) to anon,authenticated;